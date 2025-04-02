import axios from "axios";

const email = localStorage.getItem("email");
export const generatePath = async (formData: FormData) => {
    if (!formData) throw new Error("No form data")
    await axios.post("/api/ai/createPath", {
        skillName: formData.get("skill_name"),
        category: formData.get("skill_category"),
        useSkills: formData.has("use_skills"),
        useExperience: formData.has("use_experience"),
        email
    })
}