import {sql} from "../config/db.js"
export const addSkill = async (req, res) => {
    try {
        const {
            skillName,
            yearsOfExperienceInt,
            type,
            skillCategory,
            proficiency,
            description,
            email
        } = req.body;

        const user = await sql`
            SELECT user_id FROM users WHERE email = ${email}`
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const {user_id} = user[0];

        const skill = await sql`
            INSERT INTO skills (user_id, name, years_of_experience, type, skill_category, proficiency, description)
            VALUES (${user_id}, ${skillName}, ${yearsOfExperienceInt}, ${type}, ${skillCategory}, ${proficiency}, ${description})
            RETURNING *`;
        res.status(201).json(skill[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

export const getAllSkills = async (req, res) => {
    try {
        const user = await sql`
            SELECT user_id FROM users WHERE email = ${req.body.email}`
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const {user_id} = user[0];
        const skills = await sql`
            SELECT * FROM skills WHERE user_id = ${user_id}`;
        res.json(skills);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

export const deleteSkill = async (req, res) => {
    console.log(1)
    try {
        console.log(2)
        console.log(req.params.id)
        const skill = await sql`
            DELETE FROM skills WHERE skill_id = ${req.params.id} RETURNING *`
        res.status(200).json(skill)
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
}

export const updateSkill = async (req, res) => {
    try {
        const {
            skillName,
            yearsOfExperienceInt,
            type,
            skillCategory,
            proficiency,
            description,
        } = req.body;

        const skill = await sql`
            UPDATE 
                work_experience 
            SET 
                name = ${skillName}, 
                years_of_experience = ${yearsOfExperienceInt}, 
                skill_category = ${skillCategory}, 
                type = ${type}, 
                proficiency = ${proficiency}, 
                description = ${description}
            WHERE 
                skill_id = ${req.params.id}
            RETURNING *
        `;

        console.log(skill[0])
        res.status(200).json(skill[0])
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
}