import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './Auth.css';
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("https://mypet-backend-agly.onrender.com/api/v1/login", {
        // const res = await axios.post("http://localhost:4000/api/v1/login", {
        email,
        password,
      }, {
        withCredentials: true,  // important if backend sets cookies
      });

      if(res.data.success){
        toast.success("Login successful!",{
          position:"top-right",
          autoClose:1000,
        });
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        console.log(JSON.parse(sessionStorage.getItem("user")));
        
        // You can store token in localStorage if you want:
        // localStorage.setItem("token", res.data.token);
        navigate("/");  // or wherever you want
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Log In</h2>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <div className="auth-footer">
         Create account <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}


