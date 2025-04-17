import './App.css';
import ChatPage from './components/ChatPage';
import React from 'react';
import { Route, BrowserRouter as Router,Navigate } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import LoginPage from './components/authentication/Login';
import Signup from './components/authentication/SignUp';
import UserState from './contexts/users/UserState';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <UserState>
      <ToastContainer/>
     
   <Router>
    <Routes>
    <Route exact path="/login" element={<LoginPage />} />
    <Route  path="/*" element={<ChatPage />} />
    <Route exact path="/signup" element={<Signup />} />
    <Route exact path="*" element={<Navigate to="/" />} />
    </Routes>
   </Router>
      </UserState>
    </>
  );
}

export default App;
