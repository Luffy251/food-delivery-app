import React, { useState, useContext } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const LoginPopup = ({ setShowLogin }) => {
  const { loginUser, registerUser, authError, setAuthError } =
    useContext(StoreContext);

  const [currentState, setCurrentState] = useState("Sign up");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setAuthError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let result;
    if (currentState === "Login") {
      result = await loginUser(formData.email, formData.password);
    } else {
      result = await registerUser(
        formData.name,
        formData.email,
        formData.password
      );
    }

    setLoading(false);
    if (result.success) {
      setShowLogin(false);
    }
  };

  const switchState = (newState) => {
    setAuthError("");
    setFormData({ name: "", email: "", password: "" });
    setCurrentState(newState);
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            src={assets.cross_icon}
            alt="close"
            onClick={() => {
              setAuthError("");
              setShowLogin(false);
            }}
          />
        </div>

        <div className="login-popup-inputs">
          {currentState !== "Login" && (
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 chars)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        {/* Error message */}
        {authError && <p className="login-popup-error">{authError}</p>}

        {currentState === "Sign up" && (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use &amp; privacy policy</p>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : currentState === "Sign up"
              ? "Create Account"
              : "Login"}
        </button>

        {currentState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => switchState("Sign up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => switchState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
