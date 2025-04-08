import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import avatar from "../assets/avatar.webp"
import logo from "../assets/logo.jpeg"

export default function Header() {
  const email = localStorage.getItem("email");

  async function getProfileImage(email: string | null) {
    if (!email) throw new Error("No email address provided");
    try {
      const response = await axios.get(`/api/profile/profileImage/${email}`);
      return response.data.profile_image_url;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const {data: profileImage, isLoading: profileImageIsLoading} = useQuery({
    queryKey: ['profileImage'],
    queryFn: () => getProfileImage(email),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!email // Only run query if email exists
  })

  return (
    <header 
      style={{ fontFamily: "Inter" }} 
      className="h-30 w-full flex items-center justify-between px-6 bg-neutral"
    >
      <div className="flex-1 flex justify-center items-center">
        <img src={logo} alt="logo" className="size-17 md:size-21 lg:size-23 mr-2" />
        <div className="flex-col items-baseline">
            <span className="text-4xl md:text-5xl font-bold text-white font-sans tracking-tight">
              Skill
            </span>
            <span className="text-4xl md:text-5xl font-bold text-accent font-sans tracking-tight">
              Buildr
            </span>
          <p className="text-sm md:text-base text-neutral-content italic mt-1 hidden sm:block">Build your future, one skill at a time</p>
          <p className="text-sm md:text-base text-neutral-content italic mt-1 sm:hidden">Build your future <br /> One skill at a time</p>
        </div>
      </div>
      
      {/* Profile image at right */}
      <div className="flex-none">
        <Link to="/">
          <img 
              src={!profileImage || profileImageIsLoading? avatar : profileImage} 
              alt="profile settings"
              className="size-15 md:size-17 lg:size-19 object-cover rounded-full"
            />
        </Link>
      </div>
    </header>
  )
}