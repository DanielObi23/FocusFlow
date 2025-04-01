import axios from "axios";

interface WorkExperienceItem {
    experience_id: string,
    title: string,
    company: string,
    start_date: string,
    end_date: string,
    experience_category: string,
    description: string
}

export const getUserExperience = async (email: string | null) => {
    if (!email) throw new Error("Email is required")
    try {
        const response = await axios.get(`/api/experience/userExperience/${email}`);
        const sortedResponse = response.data.sort((a: WorkExperienceItem, b: WorkExperienceItem) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());
        // the sort is to make sure that the work experience is arranged based of the latest work experience
        return sortedResponse;
    } catch (error) {
        console.error(error);
    }
}