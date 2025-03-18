import { Link } from "react-router-dom"
import logo from "../assets/no_bg_logo.png"
import avatar from "../assets/avatar.avif"

export default function Header() {
  return (
    <header 
      style={{ fontFamily: "Inter" }} 
      className="h-25 w-full flex items-center justify-between px-6 bg-sky-100"
    >
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src={logo} alt="FocusFlow logo" className="size-20"/>
        </Link>
        <h1 className="text-4xl font-bold">FocusFlow</h1>
      </div>
      
      <nav className="flex items-center gap-15 font-semibold">
        <div className="flex gap-6">
          <Link to="/dashboard" className="hover:text-sky-700 hover:border-b-2 border-black hover:mx-3 duration-350 ease-in text-xl">Dashboard</Link>
          <Link to="/paths" className="hover:text-sky-700 hover:border-b-2 border-black hover:mx-3 duration-350 ease-in text-xl">Learning Paths</Link>
          <Link to="/skills" className="hover:text-sky-700 hover:border-b-2 border-black hover:mx-3 duration-350 ease-in text-xl">My Skills</Link>
        </div>
        <Link to="/profile" className="ms-80 me-20">
          <img src={avatar} alt="profile settings" className="size-15 rounded-full hover:animate-bounce"/>
        </Link>
      </nav>
    </header>
  )
}