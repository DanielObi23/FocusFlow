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