import axios from "axios";
export interface UserProfile {
    username?: string,
    email?: string,
    profile_image_url: string | null,
    created_at?: string,
    first_name: FormDataEntryValue | null,
    last_name: FormDataEntryValue | null,
    phone_number: FormDataEntryValue | null,
}

export const defaultProfile: UserProfile = {
    username: "",
    email: "",
    profile_image_url: null,
    created_at: "",
    first_name: null,
    last_name: null,
    phone_number: null
};

const email = localStorage.getItem("email");

export const getUserData = async() => {
    if (!email) {
        throw new Error("Email is required");
    }
    
    const response = await axios.get(`/api/profile/userProfile/${email}`);
    return response.data;  
}

export const updateUserProfile = async({
        profile_image_url, 
        first_name, 
        last_name, 
        phone_number
    }: UserProfile) => {
    if (!email) {
        throw new Error("Email is required");
    }
    
    const response = await axios.patch("/api/profile/updateProfile", {
        profile_image_url, 
        first_name, 
        last_name, 
        phone_number, 
        email
    });
    return response.data
}
