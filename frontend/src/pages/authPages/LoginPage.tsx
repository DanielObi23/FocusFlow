import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import toast from "../../components/toast";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  
  async function handleLogin(formData: any) {
    const email = formData.get("email");
    const password = formData.get("password");
    
    try {
      await login({ email, password });
      localStorage.setItem("email", email);
      navigate("/", {state: {email}});
    } catch (err) {
      toast({type: 'error', message: 'Incorrect password/email! Please try again'})
      console.error(err);
    }
  }
  return (
    <div className="container mx-auto mt-30 md:mt-50 px-4 py-8">
      <div className="flex flex-col justify-center items-center border-4 w-full sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto p-4 sm:p-6 md:p-8 lg:p-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 w-full">Welcome Back</h1>
        
        <form action={handleLogin} className="flex flex-col justify-center items-center gap-4 w-full">
          <div className="w-full">
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
                autoFocus
              />
            </label>
            <div className="validator-hint hidden">Enter valid email address</div>
          </div>
          
          <div className="w-full">
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
              />
            </label>
            <p className="validator-hint hidden text-sm">
              Must be more than 8 characters, including
              <br/>At least one number
              <br/>At least one lowercase letter
              <br/>At least one uppercase letter
            </p>
          </div>
          <Link to="/forgot-password" className="text-primary my-0">Forgot password? </Link>
          <button type="submit" className="btn btn-primary w-full mt-4 font-bold">
            Log In
          </button>
          <p className="text-sm mt-4">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}