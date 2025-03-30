import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "../../utils/toast";

export default function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        let timer: any;
        if (timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && buttonDisabled) {
            setButtonDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [timeLeft, buttonDisabled]);

    async function resendOTP() {
        try {
            await axios.post("/api/auth/verify-email/", {email: location.state.email});
            toast({type: 'success', message: "OTP was sent again"});
            
            // Set the timer for 3 minutes (180 seconds)
            setTimeLeft(180);
            setButtonDisabled(true);
        } catch (err) {
            console.error(err);
        }
    }

    async function verifyOTP(formData: FormData) {
        const emailOTP = formData.get("emailOTP");
        try {
            const response = await axios.post("/api/auth/verify-otp/", {
                emailOTP, 
                email: location.state.email,
            });
            const {verified, email} = response.data;
            const {password, username} = location.state;
            
            if (verified) {
                await axios.post("/api/auth/register", {
                    email, 
                    password, 
                    username
                });
                toast({type: 'success', message: `${username}, registration was successful, please login`});
                navigate("/login");
            } else {
                toast({type: 'error', message: "Server error, please try again later"});
                console.error("Email verification failed");
            }
        } catch (err) {
            toast({type: 'error', message: "Server error, please try again later"});
            console.error(err);
        }
    }

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="container mx-auto mt-30 md:mt-50 px-4 py-8">
            <div className="flex flex-col justify-center items-center border-4 w-full sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto p-4 sm:p-6 md:p-8 lg:p-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 w-full">Verify Your Email</h1>
                
                <p className="text-center mb-6">
                    We've sent a verification code to your email ({location.state.email}). Please enter it below.
                </p>
                
                <form action={verifyOTP} className="flex flex-col justify-center items-center gap-4 w-full">
                    <div className="w-full" style={{ maxWidth: "100%" }}>
                        <label className="input validator w-full">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                            </svg>
                            <input 
                                type="number" 
                                name="emailOTP" 
                                id="emailOTP" 
                                placeholder="Enter verification code" 
                                required 
                                className="w-full"
                                autoFocus
                                aria-label="Email verification code"
                            />
                        </label>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary w-full mt-4"
                        aria-label="Verify email with entered code"
                    >
                        Verify Email
                    </button>
                </form>
                
                <div className="mt-6 w-full">
                    <button 
                        onClick={resendOTP} 
                        disabled={buttonDisabled}
                        className={`w-full btn font-bold ${buttonDisabled ? 'btn-disabled' : 'btn-outline'}`}
                        aria-label={buttonDisabled ? `Resend verification code, available in ${formatTime(timeLeft)}` : "Resend verification code"}
                        aria-disabled={buttonDisabled}
                    >
                        {buttonDisabled 
                            ? `Resend Code (${formatTime(timeLeft)})` 
                            : "Resend Code"
                        }
                    </button>
                </div>
                
                <p className="text-sm mt-6 text-center">
                    Having trouble? Please check your spam folder or <Link to="/support" className="text-primary"> Contact support</Link>
                </p>
            </div>
        </div>
    );
}