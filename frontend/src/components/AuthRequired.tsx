import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext';
import { toast, Bounce } from 'react-toastify';

export default function AuthRequired() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    if (!isAuthenticated) {
        if (location.pathname !== '/logout') {
            toast.info('Login required', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
                });
        }
        return (
            <>
                <Navigate to="/login" state={{message: "Please login first"}}/>
            </>
        )
    } 
    return <Outlet />
}