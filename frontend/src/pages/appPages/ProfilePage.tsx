import { useRef, useEffect } from "react"
import AppSideBar from "../../components/ProfileSection/AppSideBar";
import ProfileHeader from "../../components/ProfileSection/profilePage/ProfileHeader";
import ExperienceSection from "../../components/ProfileSection/profilePage/ExperienceSection";
import toast from "../../components/toast";
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function ProfilePage() {
    const email = localStorage.getItem("email")
    const navigate = useNavigate();
    const profilePage = useRef(null);

    useEffect(() => {
        if (profilePage.current) {
          (profilePage.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
        }
      }, []);

    async function handleConfirmedDelete(formData: FormData) {
        const userInput = formData.get("userInput") as string;
        if (userInput.trim() !== "DELETE ACCOUNT") {
            toast({type: 'error', message: "Incorrect input: Input must be all caps and matching"});
            return
        }
        await axios.delete(`/api/delete-account/${email}`)
        navigate("/register");
        const modal = document.getElementById('delete-account-modal');
        modal && (modal as HTMLDialogElement).close();
    }

    return (
        <AppSideBar>            
            <div ref={profilePage} className="flex items-center justify-center flex-col gap-5 w-full p-4 md:p-7 xl:py-8 xl:px-10">

                <ProfileHeader />

                <ExperienceSection />

                {/* Delete profile */}
                <div className="w-full mb-4.5">
                    <div className="divider divider-error text-error">Danger Zone</div>
                    <button className="btn btn-error w-full" onClick={() => {
                                    const modal = document.getElementById('delete-account-modal');
                                    modal && (modal as HTMLDialogElement).showModal();
                                }}>DELETE ACCOUNT</button>
                </div>
                <dialog id="delete-account-modal" className="modal">
                    <form action={handleConfirmedDelete} className="modal-box w-full">
                        <div className="flex flex-col gap-2.5">
                            <p className="text-lg text-primary text-center">Are you sure you want to delete your account?</p>
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend text-sm">Type "DELETE ACCOUNT" to delete account</legend>
                                <input type="text" name="userInput" className="input w-full" placeholder="Type here" />
                                <p className="fieldset-label">This action cannot be undone.</p>
                            </fieldset>
                        </div>
                        <div className="w-full flex justify-between mt-4">
                            <button 
                                type="button" 
                                className="btn" 
                                onClick={() => {
                                    const modal = document.getElementById('delete-account-modal');
                                    modal && (modal as HTMLDialogElement).close();
                                }}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-error"> Delete </button>
                        </div>
                    </form>
                </dialog>
            </div>
        </AppSideBar>
    )
}