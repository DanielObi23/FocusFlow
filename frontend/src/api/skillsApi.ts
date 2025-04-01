import axios from "axios"
import toast from "../components/toast";


export interface Skills { // object im receiving from the backend
    name: string,
    years_of_experience: number,
    type: string,
    skill_category: string,
    proficiency: string,
    description: string,
    created_at: string,
    skill_id: string
}

export interface SkillsItem { //object im sending to the backend
    skillId?: string | null,
    skillName: FormDataEntryValue | null,
    yearsOfExperienceInt: number,
    type: FormDataEntryValue | null,
    skillCategory: FormDataEntryValue | null,
    proficiency: FormDataEntryValue | null,
    description: FormDataEntryValue | null
}

const email = localStorage.getItem('email');

export const fetchSkills = async () => {
    try {
        const response = await axios.get(`/api/skills/getAllSkills/${email}`)
        return response.data
    } catch (err) {
        toast({type: 'error', message: "Failed to load skills"})
    }
}

export const deleteUserSkill = async (skillId: string | null) => {
    if (!skillId) throw new Error ("You must provide skillId")
    const response = await axios.delete(`/api/skills/deleteSkill/${skillId}`);
    return response.data
}

export const addUserSkill = async (skill: SkillsItem) => {
    const response = await axios.post("/api/skills/addSkill", {
        skillName: skill.skillName,
        yearsOfExperienceInt: skill.yearsOfExperienceInt,
        type: skill.type,
        skillCategory: skill.skillCategory,
        proficiency: skill.proficiency,
        description: skill.description,
        email
    });
    return response.data
}

export const updateUserSkill = async (skill: SkillsItem) => {
    const response = await axios.put(`/api/skills/updateSkill/${skill.skillId}`, {
        skillName: skill.skillName,
        yearsOfExperienceInt: skill.yearsOfExperienceInt,
        type: skill.type,
        skillCategory: skill.skillCategory,
        proficiency: skill.proficiency,
        description: skill.description,
    });
    return response.data
}