import './App.css'
import { Routes,Route, useNavigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Signup from './components/Signup'
import Login from './components/Login'
import AuthSuccess from './components/AuthSuccess'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getLoggedInUser } from './features/authSlice'
import ProtectedRoute from './middlewares/ProtectedRoute'
import PublicRoute from './middlewares/PublicRoute'
import EmailSent from './components/EmailSent'
import PageNotFound from './components/PageNotFound'
function App() {

  const dispatch=useDispatch();
  const navigate=useNavigate();
  const checkLoggedIn=useSelector((state)=>state?.createAccount?.isAuthenticated);
  const checkLoggedInLoading=useSelector((state)=>state?.createAccount?.loading);

  // useEffect(() => {
  //   if (!checkLoggedInLoading) {
  //     if (checkLoggedIn) {
  //       navigate('/dashboard');
  //     } else {
  //       navigate('/login');
  //     }
  //   }
  // }, [checkLoggedInLoading, checkLoggedIn, navigate]);


  useEffect(() => {
    dispatch(getLoggedInUser());  // Restore session on mount/reload
  }, [dispatch]);


  return (
    <>
    <Routes>
      <Route path="/signup" element={<PublicRoute><Signup></Signup></PublicRoute>}></Route>
      <Route path="/login" element={<PublicRoute><Login></Login></PublicRoute>}></Route>
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}></Route>

      <Route path="/auth-success" element={<AuthSuccess></AuthSuccess>}></Route>
      <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
      <Route path="/reset-password" element={<ResetPassword></ResetPassword>}></Route>
      <Route path="/email-sent" element={<EmailSent></EmailSent>}></Route>
      <Route path="*" element={<PageNotFound></PageNotFound>}></Route>

    </Routes>
    </>
  )
}

export default App
