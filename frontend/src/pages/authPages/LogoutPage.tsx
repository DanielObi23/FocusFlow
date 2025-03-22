import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      navigate('/login', { state: { fromLogout: true } });
    };

    handleLogout();
  }, [logout, navigate]);

  return <div>Logging out...</div>;
};

export default Logout;