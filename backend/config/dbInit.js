import { sql } from "./db.js";

const initDB = async () => {
    try {
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        await sql`
            CREATE TABLE IF NOT EXISTS users (
                user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                username VARCHAR(255) NOT NULL,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                phone_number VARCHAR(20),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                password_reset_token VARCHAR(255),
                password_reset_expires TIMESTAMP,
                profile_image_url VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP WITH TIME ZONE
            )`;

        await sql`
            CREATE TABLE IF NOT EXISTS email_verification (
                email VARCHAR(255) PRIMARY KEY,
                otp VARCHAR(255) NOT NULL,
                expires TIMESTAMP NOT NULL
            )`;
            
        await sql`
            CREATE TABLE IF NOT EXISTS work_experience (
                experience_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                company VARCHAR(255) NOT NULL,
                experience_category VARCHAR(50) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE,
                description TEXT
            )`;

        await sql`
            CREATE TABLE IF NOT EXISTS skills (
                skill_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                years_of_experience INTEGER NOT NULL,
                skill_category VARCHAR(50) NOT NULL,
                type VARCHAR(20) NOT NULL,
                proficiency VARCHAR(15) NOT NULL,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )`;

        await sql`
            CREATE TABLE IF NOT EXISTS learning_paths (
                learning_path_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                skill_category VARCHAR(50) NOT NULL,
                path JSONB NOT NULL
                )`;
        console.log("Database initialized successfully!");
    } catch (err) {
        console.error("Failed to initialize database:", err);
    }
};

export default initDB;
