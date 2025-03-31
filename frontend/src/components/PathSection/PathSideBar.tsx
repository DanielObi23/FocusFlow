import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AppSideBarProps {
    children: ReactNode;
  }
  
  export default function AppSideBar({ children }: AppSideBarProps) {
    return (
        <div className="drawer lg:drawer-open">
            <input id="path-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <label 
                    htmlFor="path-drawer" 
                    className="btn btn-primary btn-md drawer-button lg:hidden fixed top-37 right-4 z-50"
                >
                    Toggle drawer
                </label>
                {children}
            </div>
            <div className="drawer-side">
                <label htmlFor="path-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li className="my-2 font-bold text-xl"><Link to="/path/learning">Learning Path</Link></li>
                    <hr />
                    <li className="my-2 font-bold text-xl"><Link to="/path/project">Project Path</Link></li>
                    <hr />
                    <li className="my-2 font-bold text-xl"><Link to="/path/career">Career Path</Link></li>
                </ul>
            </div>
        </div>
    )
}