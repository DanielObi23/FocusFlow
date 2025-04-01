import { useState } from "react"
import axios from "axios"
import { FaInfo } from "react-icons/fa";
import toast from "../../toast";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import avatar from '../../../assets/avatar.webp'
import { useQuery } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query";

interface UserProfile {
    username: string,
    email: string,
    profile_image_url: string | null,
    created_at: string,
    first_name: string | null,
    last_name: string | null,
    phone_number: string | null,
}

type email = {
    email: string | null
}

export default function ProfileHeader({email}: email) {    
    const [value, setValue] = useState<string | undefined>()    
    const queryClient = useQueryClient();

    const getUserData = async(email: string | null) => {
        if (!email) {
            throw new Error("Email is required");
        }
        
        try {
            const response = await axios.get(`/api/profile/userProfile/${email}`);
            return response.data;  
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw new Error("Error fetching user profile");
        }
    }

    const defaultProfile: UserProfile = {
        username: "",
        email: "",
        profile_image_url: null,
        created_at: "",
        first_name: null,
        last_name: null,
        phone_number: null
    };

    const {data, isLoading: profileIsLoading} = useQuery({
        queryKey: ['userProfile', email],
        queryFn: () => getUserData(email),
        staleTime: 1000 * 60 * 60, // 1 hour
        enabled: !!email // Only run query if email exists
    })
    
    const userProfile: UserProfile = data || defaultProfile;

    async function updateProfile(formData: FormData){
        try {
            const image = formData.get("image")
            const firstName = formData.get("first_name")
            const lastName = formData.get("last_name")
            let phoneNumber = formData.get("number")
            
            if (image instanceof File && image.name.length > 0) {
                const urlResponse = await axios.get("/api/profile/profileUrl")
                const uploadUrl = urlResponse.data.profile_image_url;
        
                if (image instanceof File) {
                    await axios.put(uploadUrl, image, {
                        headers: {
                            'Content-Type': image.type
                        }
                    });
        
                    const imageUrl = uploadUrl.split('?')[0];
                    if (!phoneNumber || (typeof phoneNumber === 'string' && phoneNumber.length === 0)) {
                        phoneNumber = userProfile.phone_number;
                    }
                    await axios.patch("/api/profile/updateProfile", {
                        imageUrl, 
                        firstName, 
                        lastName, 
                        phoneNumber, 
                        email
                    });
                    queryClient.invalidateQueries({ queryKey: ["userProfile", email] });
                    queryClient.invalidateQueries({ queryKey: ['profileImage'] }); // changing the profile in the header component
                }
            } else if (image instanceof File && image.name.length === 0) {
                const imageUrl = userProfile.profile_image_url
                if (!phoneNumber || (typeof phoneNumber === 'string' && phoneNumber.length === 0)) {
                    phoneNumber = userProfile.phone_number;
                }
                await axios.patch("/api/profile/updateProfile", {
                    imageUrl, 
                    firstName, 
                    lastName, 
                    phoneNumber, 
                    email
                });
                queryClient.invalidateQueries({ queryKey: ['profileImage'] }); // changing the profile in the header component
            }
        } catch (err) {
            toast({type: 'error', message: "Error updating info, please try again later"});
            console.error(err);
        }
    }

    return (
        <div className="flex justify-between items-center border-2 px-5 py-7 mt-5 flex-col gap-4 w-full">
            {profileIsLoading? 
            <div>Loading...</div> :
            <>
            <div className="flex justify-between w-full">

                {/* User profile */}
                <div className="flex flex-col w-full">
                    <div className="flex justify-between w-full">
                        <div className="flex">
                            <div className="avatar flex flex-col">
                                <div className="w-24 rounded-full">
                                    {userProfile.profile_image_url && userProfile.profile_image_url.length > 0 ? <img 
                                        src={userProfile.profile_image_url} 
                                        alt="Profile" 
                                    /> : <img 
                                    src={avatar} 
                                    alt="Profile" 
                                />}
                                </div>
                            </div>
                            <div className="ml-4 self-center">
                                <h1 className="font-bold text-start text-primary text-xl capitalize">{userProfile.username}</h1>
                                <p className="hidden md:block">Member since {new Date(userProfile.created_at).toDateString()}</p>
                            </div>
                        </div>
                        <button className="btn btn-sm md:btn-md btn-primary font-semibold" onClick={() => {
                        const modal = document.getElementById('profile-modal');
                            if (modal) {
                                (modal as HTMLDialogElement).showModal();
                            }
                        }}>Edit Info</button>
                    </div>
                    <p className="block mt-2 md:hidden">Member since {new Date(userProfile.created_at).toDateString()}</p>
                </div>

                {/* The modal for editing the profile details */}
                <div className="flex justify-between mr-3">
                    <dialog id="profile-modal" className="modal">
                        <div className="modal-box w-full">
                            <form action={updateProfile} className="flex flex-col gap-4 w-full">
                                <div className="flex gap-1">
                                    <input type="file" name="image" className="file-input w-full" /> 
                                    <div className="tooltip tooltip-left" data-tip="Profile image">
                                        <p className="btn"><FaInfo /></p>
                                    </div>
                                </div>

                                <label className="input w-full">
                                    <span className="label"><span className="font-semibold text-lg">First name:</span></span>
                                    <input type="text" name="first_name" placeholder="e.g John" defaultValue={userProfile.first_name || ""} maxLength={30}/>
                                </label>

                                <label className="input w-full">
                                    <span className="label"><span className="font-semibold text-lg">Last name:</span></span>
                                    <input type="text" name="last_name" placeholder="e.g Smith" defaultValue={userProfile.last_name || ""} maxLength={30}/>
                                </label>

                                <label className="input w-full">
                                    <PhoneInput
                                        placeholder="Enter phone number"
                                        className="w-full"
                                        name="number"
                                        value={value}
                                        onChange={setValue}/>
                                </label>
                                <div className="w-full flex justify-between">
                                    <button type="button" className="btn" onClick={()=>{
                                        const modal = document.getElementById('profile-modal');
                                        if (modal) {
                                            (modal as HTMLDialogElement).close();
                                        }
                                    }}>Cancel</button>
                                    <button type="submit" className="btn" onClick={()=>{
                                        const modal = document.getElementById('profile-modal');
                                        if (modal) {
                                            (modal as HTMLDialogElement).close();
                                        }
                                    }}>Save changes</button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                </div>
            </div>

            {/* Profile details */}
            <div className="flex w-full justify-between font-semibold gap-3 flex-col sm:flex-row">
                <fieldset className="border-2 p-5 sm:w-1/2 w-full">
                    <legend className="font-semibold text-xl text-primary">&nbsp;&nbsp;First name&nbsp;&nbsp;</legend>
                    <p className="text-accent italic capitalize text-lg">{userProfile.first_name || "Add your first name"}</p>
                </fieldset>
                <fieldset className="border-2 p-5 sm:w-1/2 w-full">
                    <legend className="font-semibold text-xl text-primary">&nbsp;&nbsp;Last name&nbsp;&nbsp;</legend>
                    <p className="text-accent italic capitalize text-lg">{userProfile.last_name || "Add your last name"}</p>
                </fieldset>
            </div>
            <div className="flex w-full justify-between font-semibold gap-3 flex-col sm:flex-row">
                <fieldset className="border-2 px-3 py-5 sm:w-1/2 w-full">
                    <legend className="font-semibold text-lg text-primary">&nbsp;&nbsp;Email&nbsp;&nbsp;</legend>
                    <p className="text-accent italic text-lg">{userProfile.email}</p>
                </fieldset>
                <fieldset className="border-2 px-3 py-5 sm:w-1/2 w-full">
                    <legend className="font-semibold text-lg text-primary">&nbsp;&nbsp;Phone number&nbsp;&nbsp;</legend>
                    <p className="text-accent italic text-lg">{userProfile.phone_number || "Add your contact number"}</p>
                </fieldset>
            </div>
            </>}
        </div>
    )
}