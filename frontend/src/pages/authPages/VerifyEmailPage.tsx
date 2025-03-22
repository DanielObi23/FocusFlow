// import {useEffect, useRef} from 'react';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Bounce } from 'react-toastify';
export default function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    async function resendOTP() {
        try {
            await axios.post("/api/auth/verify-email/", {email: location.state.email})
        } catch (err) {
            console.error(err);
        }
    }

    async function verifyOTP(formData: any) {
        const emailOTP = formData.get("emailOTP");
        try {
            const response = await axios.post("/api/auth/verify-otp/", {emailOTP, email: location.state.email,});
            const {verified, email} = response.data;
            const {password, username} = location.state;
            if (verified) {
                await axios.post("/api/auth/register", {email, password, username})
                toast.success(`${username}, registration was successful, please login`, {
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
                navigate("/login");
            } else {
                toast.error(`OTP is invalid or expired`, {
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
                console.error("Email verification failed");
            }
        } catch (err) {
            console.error(err)
        }

    }
    return (
        <>
            <h1>Verify Email Page</h1>
            <form action={verifyOTP}>
                <input type="number" name="emailOTP" id="emailOTP" placeholder="Enter OTP" />
                <button type="submit">Verify Email</button>
                <button onClick={resendOTP}>Resend OTP</button>
            </form>
        </>
    )
}