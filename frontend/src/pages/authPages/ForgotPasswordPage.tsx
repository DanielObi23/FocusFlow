import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, Bounce } from 'react-toastify';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const emailRef = useRef<HTMLButtonElement>(null);
    const resendCodeRef = useRef<HTMLButtonElement>(null);

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

    async function resendLink() {
        try {
            if (emailRef.current && resendCodeRef.current) {
                emailRef.current.disabled = true;
                resendCodeRef.current.disabled = true;
            }
            await axios.post("/api/auth/forgotPassword/", {email});
            if (emailRef.current && resendCodeRef.current) {
                emailRef.current.disabled = false;
                resendCodeRef.current.disabled = false;
            }
            toast.success(`Password reset link was sent again`, {
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
            
            // Set the timer for 3 minutes (180 seconds)
            setTimeLeft(180);
            setButtonDisabled(true);
        } catch (err) {
            console.error(err);
        }
    }

    async function sendLink(formData: any) {
        const emailInput = formData.get("email");
        setEmail(emailInput);
        try {
            if (emailRef.current && resendCodeRef.current) {
                emailRef.current.disabled = true;
                resendCodeRef.current.disabled = true;
            }
            const response = await axios.post("/api/auth/forgotPassword/", {email: emailInput});
            const message = response.data.message;

            if (emailRef.current && resendCodeRef.current) {
                emailRef.current.disabled = false;
                resendCodeRef.current.disabled = false;
            }
            if (message === "Invalid Email") {
                toast.error(`Invalid Email, please try again`, {
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
                navigate("/forgot-password");
            } else if (message === "Email sent") {
                toast.success(`Reset link sent, please check you inbox`, {
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
        } catch (err) {
            toast.error(`Internal server error, please try again in a few minutes`, {
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
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 w-full">Forgot password?</h1>
                
                <p className="text-center mb-6">
                    Please enter the email address you'd like its password reset.
                </p>
                
                <form action={sendLink} className="flex flex-col justify-center items-center gap-4 w-full">
                    <div className="w-full" style={{ maxWidth: "100%" }}>
                        <label className="input validator w-full">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                            </svg>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                placeholder="mail@site.com" 
                                required 
                                className="w-full"
                                aria-required="true"
                                aria-describedby="email-hint"
                            />
                        </label>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary w-full mt-4"
                        aria-label="Submit form to send password reset email"
                        ref={emailRef}
                    >
                        Verify Email
                    </button>
                </form>
                
                <div className="mt-6 w-full">
                    <button 
                        onClick={resendLink} 
                        disabled={buttonDisabled}
                        className={`w-full btn ${buttonDisabled ? 'btn-disabled' : 'btn-outline'}`}
                        aria-label={buttonDisabled ? `Resend password reset Link, available in ${formatTime(timeLeft)}` : "Resend password reset Link"}
                        aria-disabled={buttonDisabled}
                        ref={resendCodeRef}
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
                <p className="text-sm mt-6 text-center">
                    <Link to="/login" className="btn btn-block text-primary">&larr; back to login </Link>
                </p>
            </div>
        </div>
    );
}