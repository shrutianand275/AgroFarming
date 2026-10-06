import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          token: token,
          password: formData.password,
        }
      );

      if (response.data.success) {
        alert("Password reset successful! Please login with your new password.");
        navigate("/login");
      } else {
        setError(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: "", color: "" };
    
    if (password.length < 6) {
      return { strength: "Too Short", color: "#dc3545" };
    } else if (password.length < 8) {
      return { strength: "Weak", color: "#ffc107" };
    } else if (password.length < 12) {
      return { strength: "Good", color: "#198754" };
    } else {
      return { strength: "Strong", color: "#10b981" };
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <div className="reset-password-icon">
            🔑
          </div>

          <h2>Create New Password</h2>

          <p>
            Enter a strong password for your account
          </p>
        </div>

        {error && (
          <div className="reset-password-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>

            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                required
              />
              
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {formData.password && (
              <div className="password-strength">
                <span style={{ color: passwordStrength.color }}>
                  {passwordStrength.strength}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
              />
              
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {formData.confirmPassword && (
              <div className="password-match">
                {formData.password === formData.confirmPassword ? (
                  <span style={{ color: "#198754" }}>✓ Passwords match</span>
                ) : (
                  <span style={{ color: "#dc3545" }}>✗ Passwords don't match</span>
                )}
              </div>
            )}
          </div>

          <div className="password-requirements">
            <p><strong>Password Requirements:</strong></p>
            <ul>
              <li className={formData.password.length >= 6 ? "valid" : ""}>
                At least 6 characters
              </li>
              <li className={formData.password.length >= 8 ? "valid" : ""}>
                8+ characters recommended
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="reset-password-btn"
            disabled={loading || !token}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="reset-password-footer">
          <Link to="/login" className="back-link">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
