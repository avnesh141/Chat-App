import React, { useContext, useState } from 'react';
import './Login_page.css';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

import { ConfirmDialog } from 'primereact/confirmdialog'; // For <ConfirmDialog /> component
import userContext from '../../contexts/users/UserContext';


const LoginPage = () => {

  const navigate = useNavigate();
  const usrcntx = useContext(userContext);
  const { setCurId } = usrcntx;

  const [credential, setcredential] = useState({
    email: "",
    password: "",
  });
  const onchange = (e) => {
    setcredential({ ...credential, [e.target.name]: e.target.value });
  };
  const clickhandler = async () => {
    // console.log("first");
    if (credential.password.length < 5) {
      toast.error("Invalid password");
      return;
    }
    toast.success("Wait Your Request is processing")
    const response = await fetch(`api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credential),
    });
    // console.log("first");
    const json = await response.json();
    //  console.log(json);
    if (json.success) {
      toast.success("Logged in successfully");
      // console.log(typeof json.authtoken);
      localStorage.setItem("token",json.authtoken);
      const JWT_SECRET = "ThisisSecretKey";
      const decoded = jwtDecode(JSON.stringify(json.authtoken), JWT_SECRET);
      localStorage.setItem('id',decoded.user.id);
      setCurId(decoded.user.id);
      navigate("/chatpage");
    }
    else {
      toast.error(json.error)
    }
  };


  return (
    <div id="loginbody">
      <div className="login-page">
        <div className="form">
          <div className="login">

            <div className="login-header">
              <ConfirmDialog />
              <h3>LOGIN</h3>
              <p>Please enter your credentials to login.</p>
            </div>
          </div>
          <form className="login-form">
            <input type="email" name="email" placeholder="username" onChange={onchange} />
            <input type="password" name="password" placeholder="password" onChange={onchange} />
            <button onClick={(e) => {
              e.preventDefault();
              clickhandler();
            }} >login</button>
            <div className="AlrSignUp">
              <Link to={"/signup"}>New User? SignUp here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;