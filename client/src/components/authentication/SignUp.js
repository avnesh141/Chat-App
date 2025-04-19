import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Signup.css";
import userContext from "../../contexts/users/UserContext";
import { encryptPrivateKey, generateRSAKeyPair } from "../../contexts/users/MessageEncryption";
const Signup = () => {

  const usrcntx = useContext(userContext);
  const { setCurId } = usrcntx;

  const navigate = useNavigate();
  const [cpass, spass] = useState(null);
  const [credential, setcredential] = useState({
    name: "",
    number: "",
    email: "",
    password: "",
  });
  const onchangecnf = (e) => {
    let pass = e.target.value;
    spass(pass);
  };
  const onchange = (e) => {
    setcredential({ ...credential, [e.target.name]: e.target.value });
  };

  const clickhandler = async () => {
    console.log(credential);
    if (credential.number.length < 10) {
      toast.error("Invalid phone Number");
      return;
    }
    if (credential.password.length < 5) {
      toast.error("Password too short");
      return;
    }
    if (credential.password !== cpass) {
      toast.error("confirm password not matched");
      return;
    }
    const {privateKey,publicKey}=generateRSAKeyPair();
    console.log(credential.password,privateKey);
    const {encryptedPrivateKey,salt}=encryptPrivateKey(privateKey,JSON.stringify(credential.password));
    credential.encryptedPrivateKey=encryptedPrivateKey;
    credential.publicKey=publicKey;
    console.log(salt);
    credential.salt=salt;
    toast.success("Wait Your Request is processing")

    const response = await fetch(`api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credential),
    });
    const json = await response.json();
    if (json.success) {
      toast.success("Registered SuccessFully");
      localStorage.setItem("token", json.authtoken);
      localStorage.setItem('id',json.id);
      localStorage.setItem('password',credential.password);
      setCurId(json.id);
      navigate("/");
    } else {
      toast.error(json.error);
    }
  };



  return (
    <div id="signupbody">
      <div className="signup-container">
        <form>
          <h2 className="signUpHead">Sign Up</h2>
          <label htmlFor="name">Enter your name:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="name"
            onChange={onchange}
          />
          <label htmlFor="number">Phone:</label>
          <input
            type="number"
            id="number"
            name="number"
            required
            placeholder="7895XXXXXX"
            onChange={onchange}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="abc@gmail.com"
            required
            onChange={onchange}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            placeholder="******"
            onChange={onchange}
          />
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmpassword"
            placeholder="must be same with password"
            required
            onChange={onchangecnf}
          />
          <input
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              clickhandler();
            }}
            value="SignUp"
          />
          <div className="AlrSignUp">
            <Link to={"/"}>Already Registered Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Signup;
