import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import toast from "../../utils/toast";
import axios from "axios";

export default function RegisterPage() {
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const createAccountRef = useRef<HTMLButtonElement>(null);
  const loadingRef = useRef<HTMLElement>(null);

  // Screen reader announcement for form errors
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    if (errorMessage) {
      // Clear the message after screen readers have time to announce it
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  async function handleRegister(formData: FormData): Promise<void> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const username = formData.get("username") as string;
    
    // Check if passwords match before proceeding
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      setErrorMessage("Passwords do not match. Please check both password fields.");
      // Focus on the confirm password field
      const confirmPasswordField = document.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
      if (confirmPasswordField) confirmPasswordField.focus();
      return; // Prevent form submission
    }
    
    try {
      if (createAccountRef.current) {
        createAccountRef.current.disabled = true;
        loadingRef.current?.classList.remove("hidden");
      }

      const response = await axios.post("api/auth/verify-email", {email, password, username})

      if (createAccountRef.current) {
        createAccountRef.current.disabled = false;
        loadingRef.current?.classList.add("hidden");
      }

      if (response.data.message === "duplicate") {
        setErrorMessage("Email already in use, please try again or login");
        toast({type: 'error', message: "Email already in use, please try again or login"});
        navigate("/register")
      } else {
        toast({type: 'info', message: "Please verify email"});
        navigate("/verify-email", { state: { email, password, username } });
      }
    } catch (error) {
      console.error("Error registering/verifying user:", error);
      setErrorMessage("Error creating account. Please try again later.");
    }
  }
  
  // Function to check if passwords match on input change
  const checkPasswordsMatch = () => {
    const password = document.querySelector('input[name="password"]') as HTMLInputElement;
    const confirmPassword = document.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
    
    if (password && confirmPassword && confirmPassword.value) {
      const match = password.value === confirmPassword.value;
      setPasswordsMatch(match);
      if (!match) {
        setErrorMessage("Passwords do not match");
      } else {
        setErrorMessage(null);
      }
    } else {
      // Don't show error when confirmPassword is empty
      setPasswordsMatch(true);
      setErrorMessage(null);
    }
  };
  
  return (
    <div className="container mx-auto mt-2 sm:mt-15 md:mt-30 px-4 py-8" role="main">
      <div className="flex flex-col justify-center items-center border-4 w-full sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto p-4 sm:p-6 md:p-8 lg:p-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 w-full">
          <span 
            className="loading loading-bars loading-xl bg-accent me-3 md:me-4 lg:me-5 hidden scale-125 md:scale-150 lg:scale-200"
            aria-label="Loading, please wait"
            role="status"
            ref={loadingRef}
          ></span>
          Create Account
        </h1>
        
        {/* Accessibility: Live region for announcing errors */}
        <div 
          className="sr-only" 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
        >
          {errorMessage}
        </div>
        
        <form 
          ref={formRef}
          action={handleRegister} 
          className="flex flex-col justify-center items-center gap-4 w-full"
          aria-labelledby="registration-heading"
          noValidate
        >
          <div id="registration-heading" className="sr-only">Account Registration Form</div>
          
          <div className="w-full max-w-full">
            <label htmlFor="username" className="block mb-1 text-sm font-medium">Username</label>
            <label className="input validator w-full">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input 
                type="text" 
                name="username" 
                id="username"
                placeholder="User Name" 
                required 
                className="w-full"
                autoFocus
                aria-required="true"
                aria-describedby="username-hint"
              />
            </label>
            <div id="username-hint" className="validator-hint hidden">Please enter a username</div>
          </div>
          
          <div className="w-full max-w-full">
            <label htmlFor="email" className="block mb-1 text-sm font-medium">Email Address</label>
            <label className="input validator w-full">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
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
            <div id="email-hint" className="validator-hint hidden">Enter valid email address</div>
          </div>
          
          <div className="w-full max-w-full">
            <label htmlFor="password" className="block mb-1 text-sm font-medium">Password</label>
            <label className="input validator w-full">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
              </svg>
              <input 
                type="password" 
                name="password" 
                id="password"
                required 
                placeholder="Password" 
                minLength={8} 
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                className="w-full"
                onChange={checkPasswordsMatch}
                aria-required="true"
                aria-describedby="password-hint"
              />
            </label>
            <p id="password-hint" className="validator-hint hidden text-sm">
              Must be more than 8 characters, including
              <br/>At least one number
              <br/>At least one lowercase letter
              <br/>At least one uppercase letter
            </p>
          </div>
          
          <div className="w-full max-w-full">
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium">Confirm Password</label>
            <label className={`input w-full ${!passwordsMatch ? 'input-error' : ''}`}>
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
              </svg>
              <input 
                type="password" 
                name="confirmPassword" 
                id="confirmPassword"
                required 
                placeholder="Confirm Password" 
                className="w-full"
                onChange={checkPasswordsMatch}
                aria-required="true"
                aria-describedby="confirm-password-hint"
                aria-invalid={!passwordsMatch}
              />
            </label>
            <div 
              id="confirm-password-hint" 
              className={`text-sm ${!passwordsMatch ? '' : 'hidden'}`}
              role={!passwordsMatch ? "alert" : ""}
            >
              Passwords must match
            </div>
          </div>
          
          <div className="w-full flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              name="terms" 
              id="terms" 
              required 
              className="checkbox" 
              aria-required="true"
              aria-describedby="terms-description"
            />
            <label htmlFor="terms" className="text-sm">
              I agree to the <Link to="/register" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/register" className="text-primary hover:underline">Privacy Policy</Link>
            </label>
            <div id="terms-description" className="sr-only">You must accept the terms and privacy policy to create an account</div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full mt-6 font-bold"
            disabled={!passwordsMatch}
            aria-disabled={!passwordsMatch}
            ref={createAccountRef}
          >
            Create Account
          </button>
          
          <p className="text-sm mt-4">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}