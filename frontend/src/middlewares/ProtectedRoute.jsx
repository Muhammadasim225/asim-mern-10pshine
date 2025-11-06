// components/ProtectedRoute.js
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Spinner from '../features/Spinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.createAccount); // check slice name here

  if (loading) {
    return <Spinner/>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
    
  }

  return children;
};

export default ProtectedRoute;
