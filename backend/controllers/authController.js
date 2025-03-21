import { sql } from "../config/db.js"
import bcrypt from "bcrypt"
import jwtTokens from "../utils/jwt-helpers.js"
import createPasswordResetToken from "../utils/createPasswordResetToken.js"
import sendEmail from "../utils/sendEmail.js"
import crypto from "crypto";
import jwt from "jsonwebtoken"

export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await sql`
            SELECT * FROM users
            WHERE email = ${email}`;
        if (user.length === 0) {
            return res.status(401).json({ message: "Email is invalid" });
        }
        const validPasword = await bcrypt.compare(password, user[0].password); //password check
        if (!validPasword) {
            return res.status(401).json({ message: "Password is invalid" });
        }
        let time = new Date(Date.now() + 600000).toISOString()
        await sql `UPDATE users SET last_login = ${time} WHERE user_id = ${user[0].user_id}`
        let tokens = jwtTokens(user[0])
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds (matching JWT expiry)
          });
        res.json(tokens);
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: err.message})
    }
}

export const register = async (req, res) => {
    try {
        // First check if user already exists
        const existingUsers = await sql`
            SELECT * FROM users
            WHERE email = ${req.body.email}`;
            
        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "User already exists with this email or username"
            });
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUsers = await sql`
            INSERT INTO users (username, email, password)
            VALUES (${req.body.username}, ${req.body.email}, ${hashedPassword})
            RETURNING user_id, username, email`;
       
        res.status(201).json(newUsers[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const refreshToken = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
     
      if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token" });
      }
     
      // Make sure to import jwt at the top of your file
      // import jwt from 'jsonwebtoken';
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) {
          return res.status(403).json({ error: error.message });
        }
       
        // Create new access token
        const tokens = jwtTokens(user);
       
        res.json({ accessToken: tokens.accessToken });
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
};

export const validateToken = async (req, res) => {
    try {
      // The user object is available from the authenticateToken middleware
      const user = req.user;
      
      // You could fetch the latest user data from the database if needed
      const userData = await sql`
        SELECT user_id, username, email
        FROM users
        WHERE user_id = ${user.user_id}`;
      
      res.status(200).json({ 
        valid: true, 
        user: userData[0] 
      });
    } catch (error) {
      res.status(401).json({ valid: false, message: error.message });
    }
  };
  
export const logout = (req, res) => {
    try {
        // Clear the refresh token cookie
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const {email} = req.body;
        const user = await sql`
        SELECT * FROM users
        WHERE email = ${email}`;
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const {resetToken, passwordResetToken, passwordResetExpires} = createPasswordResetToken();
        console.log("database before updated")
        console.log(resetToken, passwordResetToken, passwordResetExpires)
        await sql`
            UPDATE users
            SET password_reset_token = ${passwordResetToken},
            password_reset_expires = ${passwordResetExpires}
            WHERE user_id = ${user[0].user_id}`;
            console.log("database updated")
        // sending the plain password reset token to user and saving the encrypted token in database
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${resetToken}`;
        const message = `Forgot your password? reset password by going to: ${resetUrl}
        \nIf you didn't forget your password, please ignore this email!
        \nLink valid only for 10 minutes.
        \nOr Create account (account creation link) or login (login link)`;
        try {
            await sendEmail({
                email: user[0].email,
                subject: "Your password reset token (valid for 10 minutes)",
                message,
            });
            console.log("email sent")
            return res.status(200).json({ 
                status: 'success',
                message: "Password reset link sent to user" });
        } catch (error) {
            const passwordResetToken = null;
            const passwordResetExpires = null;
            await sql`
            UPDATE users
            SET password_reset_token = ${passwordResetToken},
            password_reset_expires = ${passwordResetExpires}
            WHERE user_id = ${user[0].user_id}`;
            return res.status(500).json({ message: "Internal Server Error" });
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        // encrypting the token from the user to compare with that of the database
        const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await sql`SELECT * FROM users WHERE password_reset_token = ${resetToken}`;
        if (!user) {
            return res.status(400).json({ message: "Invalid token or expired" });
        } else {
            // make sure pasword and confirm password are the same
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            let time = new Date(Date.now()).toISOString()
            await sql`
                UPDATE users
                SET password = ${hashedPassword},
                password_reset_token = NULL,
                password_reset_expires = NULL
                WHERE user_id = ${user[0].user_id}`;
            await sql `UPDATE users SET updated_at = ${time}, last_login = ${time} WHERE user_id = ${user[0].user_id}`
            let tokens = jwtTokens(user[0])
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
                sameSite: 'strict', // Helps prevent CSRF attacks
                maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds (matching JWT expiry)
                });
            return res.status(200).json({ message: "Password reset successful", tokens });
        }
    } catch (error) {
        return res.status(400).json({ message: "Invalid token" });
    }
}