import { useRef, useEffect } from "react"
import AppSideBar from "../../../components/ProfileSection/ProfileSideBar";
import ProfileHeader from "../../../components/ProfileSection/profilePage/ProfileHeader";
import ExperienceSection from "../../../components/ProfileSection/profilePage/ExperienceSection";

export default function ProfilePage() {
    const email = localStorage.getItem("email");
    const profilePage = useRef(null);

    useEffect(() => {
        if (profilePage.current) {
          (profilePage.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
        }
      }, []);

    return (
        <AppSideBar>
            <div ref={profilePage} className="flex items-center justify-center flex-col gap-5 w-full p-4 md:p-7 xl:py-8 xl:px-10">

                <ProfileHeader email={email}/>

                <ExperienceSection email={email}/>

                {/* Delete profile */}
                <div className="w-full mb-4.5">
                    <div className="divider divider-error text-error">Danger Zone</div>
                    <button className="btn btn-error w-full">DELETE ACCOUNT</button>
                </div>

            </div>
        </AppSideBar>
    )
}