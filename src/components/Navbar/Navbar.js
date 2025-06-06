import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { UserContext } from "../../context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ Fixed: added this line
  const profileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function registerhandler() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      toast.success("Please login before registering your pet...", {
        position: "top-center",
        autoClose: 2000,
      });
      navigate("/signup");
    } else {
      toast.success("Register Your Pet", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <span className="logo-base">MYPET 🐾</span>

        {/* ✅ Hamburger Toggle */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        {/* ✅ Responsive Nav Menu */}
        <ul className={`nav-menu ${menuOpen ? "show" : ""}`}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li onClick={registerhandler} className="nav-item">
            <Link to="/register" className="nav-links" onClick={() => setMenuOpen(false)}>
              Register Pet
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/generate-qr" className="nav-links" onClick={() => setMenuOpen(false)}>
              Generate QR
            </Link>
          </li>

          {!user ? (
            <li className="nav-item">
              <Link to="/signup" className="nav-links" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </li>
          ) : (
            <li className="nav-item profile-dropdown" ref={profileRef}>
              <button
                className="profile-icon"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                👤
              </button>
              {showProfileMenu && (
                <div className="profile-menu">
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phone}
                  </p>
                  <Link to="/update-profile" className="update-button">
                    Update Profile
                  </Link>
                  <button onClick={logout} className="logout-button">
                    Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
      {/* <ToastContainer /> */}
    </nav>
  );
};

export default Navbar;




