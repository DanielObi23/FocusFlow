import {sql} from "../config/db.js"
import {generateUploadURL} from "../utils/s3.js"
import dotenv from "dotenv";

dotenv.config();

export const userProfile = async (req, res) => {
    try {
        console.log(req.params.email)
        const profile = await sql`
            SELECT * FROM users
            WHERE email = ${req.params.email}`;
        
        if (profile.length === 0) {
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json(profile[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
}

export const uploadProfileImage = async (req, res) => {
    try {
        const profile_image_url = await generateUploadURL()
        res.status(200).send({profile_image_url})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {
            profile_image_url, 
            first_name, 
            last_name, 
            phone_number, 
            email
        } = req.body
        
        // Construct full S3 URL if not already full URL
        const fullImageUrl = profile_image_url.startsWith('http') 
            ? profile_image_url
            : `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${profile_image_url}`
        
        const user = await sql`
            UPDATE users
            SET first_name = ${first_name},
                last_name = ${last_name},
                phone_number = ${phone_number},
                profile_image_url = ${fullImageUrl}
            WHERE email = ${email} RETURNING *
        `;

        if (user.length === 0) {
            return res.status(404).json({message: "User not found"})
        }

        res.status(200).json(user[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Invalid request"})
    }
}

export const getProfileImage = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await sql`
            SELECT profile_image_url FROM users
            WHERE email = ${email}`;
        if (user.length === 0) {
            return res.status(404).json({profile_image_url: ""})
        }
        const {profile_image_url} = user[0]
        res.status(200).json({profile_image_url})
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
}
