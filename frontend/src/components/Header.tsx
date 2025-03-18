import { Link } from "react-router-dom"
import logo from "../assets/no_bg_logo.png"
import avatar from "../assets/avatar.avif"

export default function Header() {
  return (
    <header 
      style={{ fontFamily: "Inter" }} 
      className="h-30 w-full flex flex-col md:flex-row p-2 items-center justify-between px-6 bg-sky-100"
    >
      <div className="flex items-center gap-2">
        <Link to="/profile">
          <img src={avatar} alt="profile settings" className="size-15 md:size-17 lg:hidden rounded-full hover:animate-bounce"/>
        </Link>
        <Link to="/">
          <img src={logo} alt="FocusFlow logo" className="size-18 hidden lg:block"/>
        </Link>
        <h1 className="text-4xl md:text-5xl mb-2 font-bold self-end">FocusFlow</h1>
      </div>
      
      <nav className="flex items-center gap-15 font-semibold text-lg mt-5 md:text-xl md:me-4">
        <div className="flex gap-10 lg:gap-6">
          <Link to="/dashboard" className="hover:text-sky-700 hover:border-b-2 border-black hover:mx-3 duration-350 ease-in">Dashboard</Link>
          <Link to="/paths" className="hover:text-sky-700 hover:border-b-2 border-black hover:mx-3 duration-350 ease-in"><span className="hidden xl:inline">Learning</span> Paths</Link>
          <Link to="/skills" className="hover:text-sky-700 hover:border-b-2 border-black hover:mx-3 duration-350 ease-in"><span className="hidden xl:inline">My</span> Skills</Link>
        </div>
        <Link to="/profile" className="lg:ms-20 lg:me-10 hidden lg:block">
          <img src={avatar} alt="profile settings" className="size-15 lg:size-15 rounded-full hover:animate-bounce"/>
        </Link>
      </nav>
    </header>
  )
}