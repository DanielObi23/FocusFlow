import axios from "axios"
import toast from "../components/toast";

export const fetchSkills = async (email: string | null) => {
    try {
        const response = await axios.get(`/api/skills/getAllSkills/${email}`)
        return response.data
    } catch (err) {
        toast({type: 'error', message: "Failed to load skills"})
    }
}