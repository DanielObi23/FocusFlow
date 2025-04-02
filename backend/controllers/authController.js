import { sql } from "../config/db.js"
import bcrypt from "bcrypt"
import jwtTokens from "../utils/jwt-helpers.js"
import createPasswordResetToken from "../utils/createPasswordResetToken.js"
import sendEmail from "../utils/sendEmail.js"
import crypto from "crypto";
import randomstring from "randomstring"
import jwt from "jsonwebtoken"

export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await sql`
            SELECT * FROM users
            WHERE email = ${email}`;
        if (user.length === 0) {
            return res.status(400).json({ message: "Email is invalid" });
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
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await sql`
            INSERT INTO users (username, email, password)
            VALUES (${req.body.username}, ${req.body.email}, ${hashedPassword})`;
        await sql`
            DELETE FROM email_verification WHERE email = ${req.body.email}`
        res.status(201).json({ message: "Registration successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        // First check if user already exists
        const user = await sql`
            SELECT * FROM users
            WHERE email = ${req.body.email}`;
        if (user.length > 0) {
            return res.json({ message: "duplicate" }); // DO NOT CHANGE MESSAGE TEXT

        }

        // Check if user has already requested an OTP, if so update the OTP, else create and send a new OTP
        const userOTPVerification = await sql`
            SELECT * FROM email_verification WHERE email = ${req.body.email}`;
        const OTP = randomstring.generate({length: 6, charset: 'numeric'});
        const time = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
        if (userOTPVerification.length > 0) {
            await sql`UPDATE email_verification SET otp = ${OTP}, expires = ${time} WHERE email = ${req.body.email}`;
        } else {
            await sql`INSERT INTO email_verification (otp, expires, email) VALUES (${OTP}, ${time}, ${req.body.email})`;
        }
        await sendEmail({
            email: req.body.email,
            subject: "Your FocusFlow Verification Code",
            text: `Your verification code is ${OTP}. This code will expire in 10 minutes.
          
            Thank you for using FocusFlow.`,
                html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Your Email</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                    }
                    .content {
                        background-color: #f9f9f9;
                        padding: 30px;
                        border-radius: 5px;
                    }
                    .verification-code {
                        font-size: 28px;
                        font-weight: bold;
                        text-align: center;
                        letter-spacing: 5px;
                        margin: 30px 0;
                        color: #4F46E5;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #888888;
                        margin-top: 30px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                <div class="header">
                    <h2 style="font-size: 3rem" >FocusFlow</h2>
                </div>
                <div class="content">
                    <h2>Verify Your Email</h2>
                    <p>Thanks for signing up for FocusFlow! Please use the verification code below to complete your registration:</p>
                    
                    <div class="verification-code">${OTP}</div>
                    
                    <p>This code will expire in <strong>10 minutes</strong>.</p>
                    <p>If you didn't request this code, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} FocusFlow. All rights reserved.</p>
                    <p>This is an automated message, please do not reply to this email.</p>
                </div>
                </div>
            </body>
            </html>
            `
          });
        res.status(201).json({ message: "OTP sent to email" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error with verification" });
    }
}

export const verifyOTP = async (req, res) => {
    const {emailOTP, email} = req.body;
    try {
        const user = await sql`
            SELECT * FROM email_verification
            WHERE email = ${email} AND expires > NOW()`;
        if (user.length === 0) {
            return res.status(204).json({ verified: false });
        }
        if (user[0].otp === emailOTP) {
            return res.status(200).json({ 
                verified: true,
                email
            });
        } else {
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            if (error) {
                if (error.name === 'TokenExpiredError') return res.status(403).json({ error: "Refresh token expired" });
                return res.status(403).json({ error: "Invalid refresh token" });
            }
            const tokens = jwtTokens(user);
            res.json({ accessToken: tokens.accessToken });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
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
            return res.json({ message: "Invalid Email" });
        }
        const {resetToken, passwordResetToken, passwordResetExpires} = createPasswordResetToken();
        await sql`
            UPDATE users
            SET password_reset_token = ${passwordResetToken},
            password_reset_expires = ${passwordResetExpires}
            WHERE user_id = ${user[0].user_id}`;
        // sending the plain password reset token to user and saving the encrypted token in database
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
        try {
            await sendEmail({
              email: user[0].email,
              subject: "Reset Your FocusFlow Password",
              text: `Reset your FocusFlow password by clicking: ${resetUrl}
              
            This link will expire in 10 minutes.
            
            If you didn't request a password reset, please ignore this email.
            
            Need help? Reply to this email for support.`,
                html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Your Password</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    padding: 20px 0;
                }
                .content {
                    background-color: #f9f9f9;
                    padding: 30px;
                    border-radius: 5px;
                }
                .button {
                    display: inline-block;
                    background-color: #4F46E5;
                    color: white !important;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 4px;
                    margin: 20px 0;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #888888;
                    margin-top: 30px;
                }
                .links {
                    margin-top: 20px;
                }
                .links a {
                    color: #4F46E5;
                    margin: 0 10px;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <div class="header">
                    <h2 style="font-size: 3rem">FocusFlow</h2>
                </div>
                <div class="content">
                    <h2>Reset Your Password</h2>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    
                    <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                    </div>
                    
                    <p>This link will expire in <strong>10 minutes</strong>.</p>
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
                    <p>If you didn't request a password reset, you can safely ignore this email.</p>
                    
                    <div class="links">
                    <a href="${req.protocol}://localhost:5173/login">Log In</a> | 
                    <a href="${req.protocol}://localhost:5173/register">Create Account</a>
                    </div>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} FocusFlow. All rights reserved.</p>
                    <p>This is an automated message from FocusFlow.</p>
                </div>
                </div>
            </body>
            </html>
                `
            });
            return res.status(200).json({message: "Email sent" });
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
        const resetToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
        const user = await sql`SELECT * FROM users WHERE password_reset_token = ${resetToken}`;
        if (user.length > 0 && !req.body.password) {
            return res.status(200).json({ message: "Token is valid" });
        }
        if (user.length === 0) {
            return res.status(204).json({ message: "Invalid token or expired" });
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            let time = new Date(Date.now()).toISOString()
            await sql`
                UPDATE users
                SET password = ${hashedPassword},
                password_reset_token = ${null},
                password_reset_expires = ${null}
                WHERE user_id = ${user[0].user_id}`;
            await sql `UPDATE users SET last_login = ${time} WHERE user_id = ${user[0].user_id}`
            let tokens = jwtTokens(user[0])
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
                sameSite: 'strict', // Helps prevent CSRF attacks
                maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds (matching JWT expiry)
                });
            return res.status(200).json({ message: "success" });
        }
    } catch (error) {
        return res.status(400).json({ message: "server error" });
    }
}