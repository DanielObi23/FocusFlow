import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from './contexts/AuthContext';

export default function AuthRequired() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{message: "Please login first"}}/>
    } 
    return <Outlet />
}