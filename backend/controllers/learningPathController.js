import { generateLearningPath } from "../utils/pathGenerator.js"
const workExperience = [
  {
    company: "XYZ Corp",
    title: "Senior Software Engineer",
    duration: "23/10/2002 - 12/12/2007",
    description: "created websites in php and debugged"
  },
  {
    company: "Google",
    title: "Senior Software Engineer",
    duration: "23/10/2010 - 12/12/2022",
    description: "created backend with flask"
  }
];

const skills = [
  {
    name: "php",
    yearsOfExperience: 5,
    proficiency: "Advanced"
  },
  {
    name: "Python",
    yearsOfExperience: 3,
    proficiency: "Intermediate"
  }
];

// Main function call with result handling
(async () => {
  try {
    const learningPath = await generateLearningPath("react", "Technical Skills", "1 week to a month", skills, workExperience);
    console.log(JSON.stringify(learningPath, null, 2)); // Pretty print the JSON for readability
  } catch (error) {
    console.error("Failed to generate learning path:", error);
  }
})();

export const createPath = async (req, res) => {
  try {
    const generatedPath = await generateLearningPath()
    res.status(200).json(generatedPath);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate learning path");
  }
}