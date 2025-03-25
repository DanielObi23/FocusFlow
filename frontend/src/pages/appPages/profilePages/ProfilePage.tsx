import {useEffect, useState} from "react"
import axios from "axios"
import AppSideBar from "../../../components/AppSideBar";
import { FaInfo } from "react-icons/fa";
import { toast, Bounce } from 'react-toastify';
import avatar from "../../../assets/avatar.avif";

interface userData {
    username: string,
    email: string,
    profile_image_url: string | null,
    created_at: string,
    first_name: string | null,
    last_name: string | null,
    phone_number: string | null,
  }
export default function ProfilePage() {
    const [userData, setUserData] = useState<userData>({
        username: "",
        email: "",
        profile_image_url: "",
        created_at: "",
        first_name: "",
        last_name: "",
        phone_number: ""
    })
    const email = localStorage.getItem("email");

    useEffect(() => {
        async function getUserData() {
        if (email) {
            try {
            const response = await axios.post("/api/profile/userData", { email });
            setUserData(response.data);
            } catch (error) {
            console.error(error);
            }
        }
        }
        getUserData();
    }, []);
    
    async function handleSubmit(formData: FormData) {
        try {
            const image = formData.get("image")
            const firstName = formData.get("first_name")
            const lastName = formData.get("last_name")
            const phoneNumber = formData.get("number")

            const urlResponse = await axios.get("/api/profile/profileUrl")
            const url = urlResponse.data.profile_image_url;

            await axios.put(url, image)

            const imageUrl = url.split("?")[0]
            const response = await axios.patch("/api/profile/updateProfile", {imageUrl, firstName, lastName, phoneNumber, email})
            setUserData(response.data)
            window.location.reload();
            toast.success('Profile updated successfully, refresh page to view changes', {
                position: "top-center",
                autoClose: 3000,
                theme: "colored"
            });
        } catch (err) {
            toast.error(`Error updating info, please try again later`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
              });
            console.error(err);
        }
    }

    //TODO: after account deletion, be sure to log user out, also add are you sure modal before deleting (permanent decision), they must type their username, email and password
    // then send an email to them telling them their account has been deleted
    //TODO: edit font size for username, and other headers

    return (
        <AppSideBar>
            <div className="flex items-center justify-center flex-col gap-5">
                <div className="flex justify-between items-center border-2 p-7 w-2/3 mt-5 flex-col gap-4">
                    <div className="flex justify-between w-full">
                        <div className="flex">
                            <div className="avatar flex flex-col">
                                <div className="w-24 rounded-full">
                                    <img src={userData.profile_image_url && userData.profile_image_url.length > 0 ? userData.profile_image_url : avatar} />
                                </div>
                            </div>
                            <div className="ml-4 self-center">
                                <h1 className="font-bold text-start text-primary text-lg capitalize">{userData.username}</h1>
                                <p>Member since {new Date(userData.created_at).toDateString()}</p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button className="btn btn-primary font-semibold" onClick={() => {
                                const modal = document.getElementById('my_modal_1');
                                if (modal) {
                                    (modal as HTMLDialogElement).showModal();
                                }
                            }}>Edit Info</button>
                            <dialog id="my_modal_1" className="modal">
                                <div className="modal-box w-full">
                                    <form action={handleSubmit} className="flex flex-col gap-4 w-full">
                                        <div className="flex gap-1">
                                            <input type="file" name="image" className="file-input w-full" /> 
                                            <div className="tooltip tooltip-left" data-tip="Profile image">
                                                <p className="btn"><FaInfo /></p>
                                            </div>
                                        </div>

                                        <label className="input w-full">
                                            <span className="label"><span className="font-semibold text-lg">First name:</span></span>
                                            <input type="text" name="first_name" placeholder="e.g John" defaultValue={userData.first_name? userData.first_name : ""} />
                                        </label>

                                        <label className="input w-full">
                                            <span className="label"><span className="font-semibold text-lg">Last name:</span></span>
                                            <input type="text" name="last_name" placeholder="e.g Smith" defaultValue={userData.last_name? userData.last_name : ""}/>
                                        </label>

                                        <label className="input w-full">
                                            <span className="label"><span className="font-semibold text-lg">Contact:</span></span>
                                            <input type="tel" name="number" placeholder="+44 7800 000000" defaultValue={userData.phone_number? userData.phone_number: ""}/>
                                        </label>
                                        <div className="w-full flex justify-between">
                                            <button type="button" className="btn" onClick={()=>{
                                                const modal = document.getElementById('my_modal_1');
                                                if (modal) {
                                                    (modal as HTMLDialogElement).close();
                                                }
                                            }}>Cancel</button>
                                            <button type="submit" className="btn" onClick={()=>{
                                                const modal = document.getElementById('my_modal_1');
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
                    <div className="flex p-7 w-full justify-between font-semibold gap-3">
                        <fieldset className="border-2 p-5 w-1/2">
                            <legend className="font-semibold text-xl text-primary">&nbsp;&nbsp;First name&nbsp;&nbsp;</legend>
                            <p className="text-accent italic capitalize">{userData.first_name? userData.first_name : "Add your first name"}</p>
                        </fieldset>
                        <fieldset className="border-2 p-5 w-1/2">
                            <legend className="font-semibold text-xl text-primary">&nbsp;&nbsp;Last name&nbsp;&nbsp;</legend>
                            <p className="text-accent italic capitalize">{userData.last_name? userData.last_name : "Add your last name"}</p>
                        </fieldset>
                    </div>
                    <div className="flex p-7 w-full justify-between font-semibold gap-3">
                        <fieldset className="border-2 p-5 w-1/2">
                            <legend className="font-semibold text-xl text-primary">&nbsp;&nbsp;Email&nbsp;&nbsp;</legend>
                            <p className="text-accent italic">{userData.email}</p>
                        </fieldset>
                        <fieldset className="border-2 p-5 w-1/2">
                            <legend className="font-semibold text-xl text-primary">&nbsp;&nbsp;Phone number&nbsp;&nbsp;</legend>
                            <p className="text-accent italic">{userData.phone_number? userData.phone_number: "Add your contact number"}</p>
                        </fieldset>
                    </div>
                </div>

                <fieldset className="border-2 p-7 w-2/3 flex flex-col gap-3">
                    <legend className="font-bold text-2xl text-secondary">&nbsp;&nbsp;Work experience&nbsp;&nbsp;</legend>
                    <ul className="flex flex-col gap-2.5">
                        <li className="border-2 p-7 w-full">
                            <h3>Job Title - Company Name</h3>
                            <p>Start Date - End Date</p>
                            <p>Role: .....</p>
                            <button className="btn btn-error font-semibold">Delete</button>
                        </li>
                        <li className="border-2 p-7 w-full">
                            <h3>Job Title - Company Name</h3>
                            <p>Start Date - End Date</p>
                            <p>Role: .....</p>
                            <button className="btn btn-error font-semibold">Delete</button>
                        </li>
                        <li className="border-2 p-7 w-full">
                            <h3>Job Title - Company Name</h3>
                            <p>Start Date - End Date</p>
                            <p>Role: .....</p>
                            <button className="btn btn-error font-semibold">Delete</button>
                        </li>
                    </ul>
                </fieldset>
                <div className="w-2/3 mb-4.5">
                    <div className="divider divider-error text-error">Danger Zone</div>
                    <button className="btn btn-error w-full">DELETE ACCOUNT</button>
                </div>
            </div>
        </AppSideBar>
    )
}
