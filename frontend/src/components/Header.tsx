import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import avatar from "../assets/avatar.webp"

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
      className="h-30 w-full flex items-center justify-between px-6 bg-base-300"
    >
      <div className="flex-1 flex justify-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">FocusFlow</h1>
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