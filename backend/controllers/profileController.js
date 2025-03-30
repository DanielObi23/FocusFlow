import {sql} from "../config/db.js"
import {generateUploadURL} from "../utils/s3.js"
import sendEmail from "../utils/sendEmail.js";
import dotenv from "dotenv";

dotenv.config();

export const userProfile = async (req, res) => {
    try {
        const profile = await sql`
            SELECT * FROM users
            WHERE email = ${req.body.email}`;
        
        if (profile.length === 0) {
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json({profile: profile[0]});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
}

export const userExperience = async (req, res) => {
    try {
        const profile = await sql`
            SELECT user_id FROM users
            WHERE email = ${req.body.email}`;
        
        if (profile.length === 0) {
            return res.status(404).json({message: "User not found"})
        }

        const userId = profile[0].user_id;
        const work_experience = await sql`
            SELECT * FROM work_experience
            WHERE user_id = ${userId}`

        res.status(200).json({work_experience});
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
            email,
            firstName,
            lastName,
            phoneNumber,
            imageUrl
        } = req.body
        
        // Construct full S3 URL if not already full URL
        const fullImageUrl = imageUrl.startsWith('http') 
            ? imageUrl 
            : `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageUrl}`
        
        const user = await sql`
            UPDATE users
            SET first_name = ${firstName},
                last_name = ${lastName},
                phone_number = ${phoneNumber},
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
        const { email } = req.body;
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

export const addWorkExperience = async (req, res) => {
    try {
        const user = await sql`
            SELECT user_id FROM users WHERE email = ${req.body.email}`
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const {user_id} = user[0];
        const workExperience = await sql`
            INSERT INTO work_experience 
            (user_id, title, company, experience_category, start_date, end_date, description)
            VALUES (${user_id}, ${req.body.title}, ${req.body.company}, ${req.body.experienceCategory}, ${req.body.startDate}, ${req.body.endDate}, ${req.body.description}) RETURNING *
        `;

        res.status(201).json(workExperience[0])
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
}

export const deleteWorkExperience = async (req, res) => {
    try {
        await sql`
            DELETE FROM work_experience WHERE experience_id = ${req.params.id}`
        res.status(200).json({message: "deletion successful"})
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
}

export const updateWorkExperience = async (req, res) => {
    try {
        const {
            title,
            company,
            experienceCategory,
            startDate,
            endDate,
            description
        } = req.body
        const experience = await sql`
            UPDATE 
                work_experience 
            SET title = ${title}, 
                company = ${company}, 
                experience_category = ${experienceCategory}, 
                start_date = ${startDate}, 
                end_date = ${endDate}, 
                description = ${description}
            WHERE 
                experience_id = ${req.params.id}
            RETURNING *
        `;
        res.status(200).json(experience[0])
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
}

export const sendFeedback = async (req, res) => {
    try {
        const { email, subject, message } = req.body;
        sendEmail({
            myEmail: process.env.MY_EMAIL,
            subject,
            text: message,
            html: `Feedback from ${email}: <br/> <br/>${message}`,
            name: "user"
        })
        res.status(200).json({message: "Feedback sent"})
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
}