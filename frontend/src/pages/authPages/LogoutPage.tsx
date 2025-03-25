import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast, Bounce } from 'react-toastify';

const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      toast.success(`Successfully logged out`, {
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
      localStorage.removeItem("email")
      navigate('/login', { state: { fromLogout: true } });
    };

    handleLogout();
  }, [logout, navigate]);

  return <div>Logging out...</div>;
};

export default Logout;