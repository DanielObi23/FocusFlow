import {sql} from "../config/db.js"

export const userExperience = async (req, res) => {
    try {
        const profile = await sql`
            SELECT user_id FROM users
            WHERE email = ${req.params.email}`;
        
        if (profile.length === 0) {
            return res.status(404).json({message: "User not found"})
        }

        const userId = profile[0].user_id;
        const work_experience = await sql`
            SELECT * FROM work_experience
            WHERE user_id = ${userId}`

        res.status(200).json(work_experience);
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