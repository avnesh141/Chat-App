import './App.css';
import ChatPage from './components/ChatPage';
import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import LoginPage from './components/authentication/Login';
import Signup from './components/authentication/SignUp';
import UserState from './contexts/users/UserState';
function App() {
  return (
    <>
      <UserState>
   <Router>
    <Routes>
    <Route exact path="/" element={<LoginPage />} />
    <Route exact path="/chatpage" element={<ChatPage />} />
    <Route exact path="/signup" element={<Signup />} />
    </Routes>
   </Router>
      </UserState>
    </>
  );
}

export default App;
