import { ReactNode } from "react";
import { Link } from "react-router-dom";
import ThemeController from "./ThemeController"

interface AppSideBarProps {
    children: ReactNode;
  }
  
  export default function AppSideBar({ children }: AppSideBarProps) {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <label 
                    htmlFor="my-drawer-2" 
                    className="btn btn-primary drawer-button lg:hidden fixed top-40 right-4 z-50"
                >
                    Toggle drawer
                </label>
                {children}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li className="my-2 font-bold text-xl"><Link to="/profile">Profile</Link></li>
                    <hr />
                    <li className="my-2 font-bold text-xl"><Link to="/skills">Skills & Interest</Link></li>
                    <hr />
                    <li className="my-2 font-bold text-xl"><Link to="/achievements">Achievements Library</Link></li>
                    <hr />
                    <li className="my-2 font-bold text-xl"><Link to="/support">Feedback</Link></li>
                    <hr />
                    <li className="my-2 font-bold text-xl"><Link to="/logout">Logout</Link></li>
                    <hr />
                    <ThemeController />
                </ul>
            </div>
        </div>
    )
}