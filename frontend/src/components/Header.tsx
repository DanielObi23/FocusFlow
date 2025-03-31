import { Link } from "react-router-dom"
import logo from "../assets/no_bg_logo.png"
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
      className="h-35 w-full flex flex-col md:flex-row p-2 items-center justify-between px-6 bg-base-300"
    >
      <div className="flex items-center gap-2 mt-3">
        <Link to="/profile">
          {profileImage ? 
          <img 
            src={profileImage} 
            alt="profile settings" 
            className="size-15 md:size-17 lg:hidden object-cover rounded-full"
          /> : <img 
          src={avatar} 
          alt="profile settings" 
          className="size-15 md:size-17 lg:hidden object-cover rounded-full"
        />}
        </Link>
        <Link to="/">
          <img src={logo} alt="FocusFlow logo" className="size-22 hidden lg:block xl:active:size-24 xl:active:animate-bounce xl:active:translate-x-150 duration-3000"/>
        </Link>
        <h1 className="text-4xl md:text-6xl mb-2 font-bold self-end">FocusFlow</h1>
      </div>
      <nav className="flex items-center gap-15 font-semibold text-lg mt-5 md:text-xl md:me-4">
        <div className="flex gap-10 lg:gap-6">
          <Link to="/dashboard" className="md:focus:outline-2 md:focus:border-b-0 md:focus:outline-offset-7 hover:text-accent hover:border-b-2 hover:mx-3 duration-350 ease-in md:text-2xl">Dashboard</Link>
          <Link to="/path/learning" className="md:focus:outline-2 md:focus:border-b-0 md:focus:outline-offset-7 hover:text-accent hover:border-b-2 hover:mx-3 duration-350 ease-in md:text-2xl">Paths <span className="hidden xl:inline">Library</span></Link>
        </div>
        <Link to="/profile" className="lg:ms-5 lg:me-10 hidden lg:block">
          {profileImage ? 
            <img 
              src={profileImage} 
              alt="profile settings"
              className="size-15 lg:size-20 object-cover rounded-full"
            /> : <img 
            src={avatar} 
            alt="profile settings"
            className="size-15 lg:size-20 object-cover rounded-full"
          />}
        </Link>
      </nav>
    </header>
  )
}