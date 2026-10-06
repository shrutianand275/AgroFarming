import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      if (response.data.success) {
        setSent(true);
        setMessage(response.data.message);
      } else {
        setError(response.data.message || "Failed to send reset link.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to process request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="forgot-password-icon">
            🔐
          </div>

          <h2>Forgot Password?</h2>

          <p>
            {sent
              ? "Check your email for reset instructions"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {error && (
          <div className="forgot-password-error">
            {error}
          </div>
        )}

        {message && (
          <div className="forgot-password-success">
            {message}
          </div>
        )}

        {!sent && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
              />
            </div>

            <button
              type="submit"
              className="forgot-password-btn"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {sent && (
          <div className="success-instructions">
            <div className="instruction-box">
              <h3>📧 What's Next?</h3>
              <ol>
                <li>Check your email inbox</li>
                <li>Click the reset link (valid for 1 hour)</li>
                <li>Create a new password</li>
                <li>Login with your new credentials</li>
              </ol>
            </div>

            <p className="resend-note">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                className="resend-link"
                onClick={() => {
                  setSent(false);
                  setMessage("");
                  setError("");
                }}
              >
                try again
              </button>
            </p>
          </div>
        )}

        <div className="forgot-password-footer">
          <Link to="/login" className="back-link">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
