import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await loginUser(formData);

      if (response.success) {

        localStorage.setItem(
          "agroToken",
          response.token
        );

        localStorage.setItem(
          "agroUser",
          JSON.stringify(response.user)
        );

        navigate("/");

        window.location.reload();

      } else {

        setError(
          response.message || "Login failed."
        );

      }

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Unable to connect to server."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <div className="login-icon">
            🌿
          </div>

          <h2>Welcome Back</h2>

          <p>
            Login to your AgroFarming account
          </p>

        </div>


        {error && (

          <div className="login-error">
            {error}
          </div>

        )}


        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Email or Phone Number
            </label>

            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter email or phone"
              required
            />

          </div>


          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />

          </div>


          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>

        </form>


        <div className="login-footer">

          <span>
            Don't have an account?
          </span>

          <Link to="/signup">
            Create Account
          </Link>

        </div>

      </div>

    </div>

  );
}

export default Login;