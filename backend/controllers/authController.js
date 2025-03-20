import { sql } from "../config/db.js"
import bcrypt from "bcrypt"
import jwtTokens from "../utils/jwt-helpers.js"

export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await sql`
            SELECT * FROM users
            WHERE email = ${email}`;
        if (user[0].length === 0) {
            return res.status(401).json({ message: "Email is invalid" });
        }
        const validPasword = await bcrypt.compare(password, user[0].password); //password check
        if (!validPasword) {
            return res.status(401).json({ message: "Password is invalid" });
        }
        let tokens = jwtTokens(user[0])
        res.cookie("refresh_token", tokens.refresh_token, {httpOnly:true})
        res.json(tokens);
    } catch (err) {
        console.log("error")
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
      const refreshToken = req.cookies.refresh_token;
     
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

  export const logout = (req, res) => {
    try {
        // Clear the refresh token cookie
        res.clearCookie('refresh_token');
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};