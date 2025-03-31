import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import avatar from "../assets/avatar.webp"

export default function Header() {
  //TODO: for header background, consider changing the background to bg-gradient-to-r from-primary to-secondary, after making the whole app
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    async function fetchProfileImage() {
      const response = await axios.post("/api/profile/profileImage", {email: localStorage.getItem("email")});
      setProfileImage(response.data.profile_image_url);
    };
    fetchProfileImage()
  }, [])
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
        <Link to="/profile">
          <img 
              src={profileImage? profileImage : avatar} 
              alt="profile settings"
              className="size-15 md:size-17 lg:size-19 object-cover rounded-full"
            />
        </Link>
      </div>
    </header>
  )
}