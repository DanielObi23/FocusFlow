import axios from "axios";

export type phase = 
    {
        order: number,
        title: string,
        type: string,
        resources: {
            free: [{title: string, url: string}] | [],
            paid: [{title: string, url: string}] | [],
        },
        checklist?: string[],
        practiceDetails?: {
            objective: string,
            deliverables: string[]
        }
    }


export interface Path {
    learning_path_id?: string,
    path: {
        title: string,
        phases: phase[],
        keyConcepts: string[]
    }
}

const email = localStorage.getItem("email");
export const generatePath = async (formData: FormData) => {
    if (!formData) throw new Error("No form data")
    const response = await axios.post("/api/ai/createPath", {
        skillName: formData.get("skill_name"),
        category: formData.get("skill_category"),
        preference: formData.get("preference"),
        useSkills: formData.has("use_skills"),
        useExperience: formData.has("use_experience"),
        email
    })
    return response.data
}

export const getPaths = async () => {
    const response = await axios.get(`/api/ai/getPaths/${email}`)
    return response.data
}

export const deletePath = async (id: string) => {
    const response = await axios.delete(`/api/ai/deletePath/${id}`)
    return response.data
}

export const completePath = async (id: string) => {
    const response = await axios.post(`/api/ai/completePath/${id}`)
    return response.data
}