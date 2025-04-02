import { generateLearningPath } from "../utils/pathGenerator.js"
import { sql } from "../config/db.js"


export const createPath = async (req, res) => {
  try {
    console.log(1)
    const { skillName, category, useSkills, useExperience, email } = req.body;
    if (!skillName || !category) {
      return res.status(400).json({ error: "Missing required fields: skillName and category are required" });
    }

    const user = await sql `SELECT user_id FROM users WHERE email = ${email}`;
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const { user_id } = user[0];
    let skills = []
    if (useSkills) {
      skills = await sql `SELECT name, years_of_experience, proficiency FROM skills
                        WHERE user_id = ${user_id}`;
    }

    let experience = []
    if (useExperience) {
      experience = await sql `SELECT company, title, start_date, end_date FROM work_experience
                            WHERE user_id = ${user_id}`;
    }
    console.log(2)
    const generatedPath = await generateLearningPath({skillName, category, skills, experience})
    console.log("\n\n", generatedPath, "\n\n\n")
    await sql `INSERT INTO learning_paths
              (user_id, path, skill_category, name) VALUES (${user_id}, ${generatedPath}, ${category}, ${skillName})`;
    console.log(4)
    res.status(201)
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate learning path");
  }
}