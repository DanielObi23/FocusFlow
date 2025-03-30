import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from "../../utils/toast";
import TruckLoader from "../../components/TruckLoader"
const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      toast({type: 'success', message: "Successfully logged out"});
      localStorage.removeItem("email")
      navigate('/login', { state: { fromLogout: true } });
    };

    handleLogout();
  }, [logout, navigate]);

  return <TruckLoader />;
};

export default Logout;