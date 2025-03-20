import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const location = useLocation();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate(); // Add this hook
  
  async function handleRegister(formData: any): Promise<void> {
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const username = formData.get("username");
    
    // Check if passwords match before proceeding
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return; // Prevent form submission
    }

    try {
      const response = await axios.post("/api/auth/register", {
        email,
        password,
        username,
      });
      
      if (response.status === 201) {
        console.log("User registered successfully");
        navigate("/login", { state: { message: "Successfully Registered, Login" } });
      } 
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        console.log("User already exists");
        navigate("/login", { state: { message: "Email already in use, please login" } });
      } else {
        console.error("Error registering user:", error);
        alert("Error registering user");
      }
    }
    
    console.log("Registration attempt:", { email, password, confirmPassword, username });
  }
  
  // Function to check if passwords match on input change
  const checkPasswordsMatch = () => {
    const password = document.querySelector('input[name="password"]') as HTMLInputElement;
    const confirmPassword = document.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
    
    if (password && confirmPassword && confirmPassword.value) {
      setPasswordsMatch(password.value === confirmPassword.value);
    } else {
      // Don't show error when confirmPassword is empty
      setPasswordsMatch(true);
    }
  };
  
  return (
    <div className="container mx-auto mt-30 md:mt-50 px-4 py-8">
      {location.state?.message && (
        <p className="base-300 text-xl md:text-2xl lg:text-3xl font-serif text-center mb-4">
          {location.state.message}
        </p>
      )}
      <div className="flex flex-col justify-center items-center border-4 w-full sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto p-4 sm:p-6 md:p-8 lg:p-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 w-full">Create Account</h1>
        
        <form action={handleRegister} className="flex flex-col justify-center items-center gap-4 w-full">
        <div className="w-full max-w-full">
            <label className="input validator w-full">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input 
                type="text" 
                name="username" 
                placeholder="User Name" 
                required 
                className="w-full"
              />
            </label>
            <div className="validator-hint hidden">Please enter a username</div>
          </div>
          
          <div className="w-full max-w-full">
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
                placeholder="mail@site.com" 
                required 
                className="w-full"
              />
            </label>
            <div className="validator-hint hidden">Enter valid email address</div>
          </div>
          
          <div className="w-full max-w-full">
            <label className="input validator w-full">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
              </svg>
              <input 
                type="password" 
                name="password" 
                required 
                placeholder="Password" 
                minLength={8} 
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                className="w-full"
                onChange={checkPasswordsMatch}
              />
            </label>
            <p className="validator-hint hidden text-sm">
              Must be more than 8 characters, including
              <br/>At least one number
              <br/>At least one lowercase letter
              <br/>At least one uppercase letter
            </p>
          </div>
          
          <div className="w-full max-w-full">
            <label className={`input w-full ${!passwordsMatch ? 'input-error' : ''}`}>
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
              </svg>
              <input 
                type="password" 
                name="confirmPassword" 
                required 
                placeholder="Confirm Password" 
                className="w-full"
                onChange={checkPasswordsMatch}
              />
            </label>
            <div className={`text-sm ${!passwordsMatch ? '' : 'hidden'}`}>Passwords must match</div>
          </div>
          
          <div className="w-full flex items-center gap-2 mt-2">
            <input type="checkbox" name="terms" id="terms" required className="checkbox" />
            <label htmlFor="terms" className="text-sm">
              I agree to the <Link to="/register" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/register" className="text-primary hover:underline">Privacy Policy</Link>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full mt-6"
            disabled={!passwordsMatch}
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