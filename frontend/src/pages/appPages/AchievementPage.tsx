import AppSideBar from "../../components/ProfileSection/AppSideBar";
import { Link } from "react-router-dom"
export default function AchievementPage() {
    return (
        <AppSideBar>
            <h1>Achievement Page</h1>
            <div className="tabs tabs-box flex gap-4 p-3">
                <button type="button"><Link to="/learning-paths" className="btn focus:outline-2 focus:outline-secondary focus:outline-offset-2" aria-label="Tab 1">Paths</Link></button>
                <button><Link to="/achievements" type="radio" className="btn focus:outline-2 focus:outline-secondary focus:outline-offset-2" aria-label="Tab 2">Achievements</Link></button>
            </div>
        </AppSideBar>
    )
}