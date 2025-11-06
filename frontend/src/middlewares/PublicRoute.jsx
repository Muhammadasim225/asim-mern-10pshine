// src/middlewares/PublicRoute.js
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Spinner from '../features/Spinner';
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.createAccount);

  if (loading) return <Spinner></Spinner>

  if (isAuthenticated) {

    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
