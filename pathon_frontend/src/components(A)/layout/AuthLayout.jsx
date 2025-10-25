import { Navigate } from 'react-router-dom';
import MainLayout from './MainLayout';

const AuthLayout = ({ children }) => {
  // You can add authentication check logic here
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default AuthLayout;