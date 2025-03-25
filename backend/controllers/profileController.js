import { profile } from "console";
import {sql} from "../config/db.js"
import {generateUploadURL} from "../utils/s3.js"

export const userData = async (req, res) => {
    try {
        const users = await sql`
            SELECT * FROM users
            WHERE email = ${req.body.email}`;
        
        if (users.length === 0) {
            return res.status(404).json({message: "User not found"})
        }

        const { 
            username, 
            email, 
            profile_image_url, 
            created_at, 
            first_name, 
            last_name, 
            phone_number 
        } = users[0];

        res.json({
            username, 
            email, 
            profile_image_url, 
            created_at, 
            first_name, 
            last_name, 
            phone_number
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
}

export const uploadProfileImage = async (req, res) => {
    try {
        const profile_image_url = await generateUploadURL()
        res.send({profile_image_url})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {
            email,
            firstName,
            lastName,
            phoneNumber,
            imageUrl
        } = req.body

        const users = await sql`
            UPDATE users
            SET first_name = ${firstName},
                last_name = ${lastName},
                phone_number = ${phoneNumber},
                profile_image_url = ${imageUrl}
            WHERE email = ${email} RETURNING *
        `;

        if (users.length === 0) {
            return res.status(404).json({message: "User not found"})
        }

        const { 
            username,
            profile_image_url, 
            created_at, 
            first_name, 
            last_name, 
            phone_number 
        } = users[0];

        const response = {
            username, 
            email, 
            profile_image_url, 
            created_at, 
            first_name, 
            last_name, 
            phone_number
        };

        console.log(response);
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: "Invalid request"})
    }
}

export const getProfileImage = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await sql`
            SELECT profile_image_url FROM users
            WHERE email = ${email}`;
        const {profile_image_url} = user[0]
        if (user.length === 0) {
            return res.status(404).json({profile_image_url: ""})
        }
        res.json({profile_image_url})
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
}