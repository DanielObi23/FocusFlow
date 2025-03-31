import { ReactNode } from "react";
import { Link } from "react-router-dom";
import ThemeController from "./ThemeController"

interface AppSideBarProps {
    children: ReactNode;
  }
  
  export default function AppSideBar({ children }: AppSideBarProps) {
    return (
        <div className="drawer lg:drawer-open">
            <input id="profile-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <label 
                    htmlFor="profile-drawer" 
                    className="btn btn-primary btn-md drawer-button lg:hidden fixed top-37 right-4 z-50"
                >
                    Toggle drawer
                </label>
                {children}
            </div>
            <div className="drawer-side">
                <label htmlFor="profile-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li className="my-2 font-bold text-xl"><Link to="/profile">Profile</Link></li>
                    <hr />
                    <li className="my-2 font-bold text-xl"><Link to="/skills">Skills & Interest</Link></li>
                    <hr />
                    <li className="my-2 font-bold text-xl"><Link to="/learning-paths">Learning Paths</Link></li>
                    <hr />
                    <li className="my-2 font-bold text-xl"><Link to="/feedback">Feedback</Link></li>
                    <hr />
                    <li className="my-2 font-bold text-xl"><ThemeController /></li>
                    <hr />
                    <li className="my-2 font-bold text-xl"><Link to="/logout">Logout</Link></li>
                </ul>
            </div>
        </div>
    )
}