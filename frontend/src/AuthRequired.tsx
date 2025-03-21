import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from './contexts/AuthContext';
//import { ToastContainer, toast } from 'react-toastify';

export default function AuthRequired() {
    const { isAuthenticated } = useAuth();
    console.log(isAuthenticated);
    if (!isAuthenticated) {
        //toast('Wow so easy !');
        //<ToastContainer />
        return <Navigate to="/login" state={{message: "Please login first"}}/>
    } 
    return <Outlet />
}