import {useEffect, useState} from "react"
import axios from "axios"
import ThemeController from "../components/ThemeController"
import { Link } from 'react-router-dom';

export default function ProfilePage() {
    type userObj = {
        message?: string
    }

    const [userData, setUserData] = useState<userObj>({})
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/profile")
                setUserData(response.data)
            } catch (err) {
                setUserData({message: "Failed to load user data"})
                console.error(err)
            }
        }
        console.log("Fetching data")
        fetchData()
    }, [])

    return (
        <>
        <h1>Profile Page</h1>
        <h2>Message: {userData.message ? userData.message : "no data"}</h2>
        <ThemeController />
        <Link to="/logout">Logout</Link>
        </>
    )
}
