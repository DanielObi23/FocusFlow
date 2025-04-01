import axios from "axios";
import toast from "../components/toast";

export interface WorkExperienceItem { // object im receiving from the backend
    experience_id: string,
    title: string,
    company: string,
    start_date: string,
    end_date: string,
    experience_category: string,
    description: string
}

export interface ExperienceItem { //object im sending to the backend
    experience_id?: string,
    title: FormDataEntryValue | null,
    company: FormDataEntryValue | null,
    startDate: FormDataEntryValue | null,
    endDate: FormDataEntryValue | null,
    experienceCategory: FormDataEntryValue | null,
    description: FormDataEntryValue | null
}

const email = localStorage.getItem('email');
export const getUserExperience = async () => {
    if (!email) throw new Error("Email is required")
    try {
        const response = await axios.get(`/api/experience/userExperience/${email}`);
        const sortedResponse = response.data.sort((a: WorkExperienceItem, b: WorkExperienceItem) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());
        // the sort is to make sure that the work experience is arranged based of the latest work experience
        return sortedResponse;
    } catch (error) {
        console.error(error);
        toast({type: "error", message: "Error fetching user experience, please try again later"});
    }
}

export const deleteUserExperience = async ( id: string | null) => {
    if (!id) throw new Error("Experience ID is required");
    await axios.delete(`/api/experience/deleteWorkExperience/${id}`);
}

export const editUserExperience = async ({
        experience_id,
        title,
        company,
        startDate,
        endDate,
        experienceCategory,
        description
    }: ExperienceItem) => {
        
    if (!experience_id) throw new Error("Experience ID is required");
    await axios.put(`/api/experience/updateWorkExperience/${experience_id}`, {
        title,
        company,
        startDate,
        endDate,
        experienceCategory,
        description,
        email
    });
}

export const addUserExperience = async ({
        title,
        company,
        startDate,
        endDate,
        experienceCategory,
        description
    }: ExperienceItem) => {
    await axios.post(`/api/experience/addWorkExperience`, {
        title,
        company,
        startDate,
        endDate,
        experienceCategory,
        description,
        email
    });
}