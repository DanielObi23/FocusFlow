import { generateLearningPath } from "../utils/pathGenerator.js"
import { sql } from "../config/db.js"


export const createPath = async (req, res) => {
  try {
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
    
    const generatedPath = await generateLearningPath({skillName, category, skills, experience})
    await sql `INSERT INTO learning_paths
              (user_id, path, skill_category, name) VALUES (${user_id}, ${generatedPath}, ${category}, ${skillName})`;
              
    res.status(201).json({ success: true, message: "Learning path created successfully" });
  } catch (error) {
    console.error("Failed to generate learning path", error);
    res.status(500).json({ error: "Failed to generate learning path" });
  }
}

export const getPaths = async (req, res) => {
  try {
    const user = await sql `SELECT user_id FROM users WHERE email = ${req.params.email}`;
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const { user_id } = user[0];
    const paths = await sql`SELECT path, learning_path_id FROM learning_paths WHERE user_id = ${user_id}`;
    res.status(200).json(paths);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get learning paths");
  }
}

export const deletePath = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`DELETE FROM learning_paths WHERE learning_path_id = ${id}`;
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Learning path not found" });
    }
    res.status(200).json({ success: true, message: "Learning path deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete learning path" });
  }
}

export const completePath = async (req, res) => {
  // get the skill_category and name from learning_paths from id
  // update the skill list in skills
  // delete the path from learning paths from id
}