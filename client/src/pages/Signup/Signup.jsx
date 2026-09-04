import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Sprout,
  LandPlot,
  Droplets,
  ArrowRight,
  ChevronDown
} from "lucide-react";

import { registerUser } from "../../services/api";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [showFarmInfo, setShowFarmInfo] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    state: "",
    district: "",
    village: "",
    farmSize: "",
    soilType: "",
    irrigation: "",
    mainCrop: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,

        state: formData.state.trim(),
        district: formData.district.trim(),
        village: formData.village.trim(),
        farmSize: formData.farmSize,
        soilType: formData.soilType,
        irrigation: formData.irrigation,
        mainCrop: formData.mainCrop.trim()
      });

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
          response.message || "Registration failed."
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
    <div className="signup-page">

      <div className="signup-card">

        {/* ================= HEADER ================= */}

        <div className="signup-header">

          <div className="signup-logo">
            <Sprout size={25} />
          </div>

          <div>
            <h2>Create Your Account</h2>

            <p>
              Join AgroFarming for smarter farming decisions
            </p>
          </div>

        </div>


        {/* ================= ERROR ================= */}

        {error && (
          <div className="signup-error">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          {/* ================= ACCOUNT INFORMATION ================= */}

          <div className="signup-section">

            <div className="signup-section-title">
              <User size={18} />
              <span>Account Information</span>
            </div>


            <div className="signup-grid">

              {/* NAME */}

              <div className="signup-field">

                <label>
                  Full Name <span>*</span>
                </label>

                <div className="signup-input">

                  <User size={16} />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="signup-field">

                <label>
                  Email Address <span>*</span>
                </label>

                <div className="signup-input">

                  <Mail size={16} />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />

                </div>

              </div>


              {/* PHONE */}

              <div className="signup-field">

                <label>
                  Phone Number <span>*</span>
                </label>

                <div className="signup-input">

                  <Phone size={16} />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        setFormData({ ...formData, phone: value });
                      }
                    }}
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="signup-field">

                <label>
                  Password <span>*</span>
                </label>

                <div className="signup-input">

                  <Lock size={16} />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    minLength="6"
                    required
                  />

                </div>

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="signup-field">

                <label>
                  Confirm Password <span>*</span>
                </label>

                <div className="signup-input">

                  <Lock size={16} />

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    minLength="6"
                    required
                  />

                </div>

              </div>

            </div>

          </div>


          {/* ================= FARM INFORMATION DROPDOWN ================= */}

          <div className="farm-dropdown">

            <button
              type="button"
              className="farm-dropdown-header"
              onClick={() =>
                setShowFarmInfo(!showFarmInfo)
              }
            >

              <div className="farm-dropdown-title">

                <div className="farm-dropdown-icon">
                  <Sprout size={18} />
                </div>

                <div>
                  <strong>
                    Farm Information
                  </strong>

                  <small>
                    Optional · You can add this later
                  </small>
                </div>

              </div>


              <ChevronDown
                size={20}
                className={
                  showFarmInfo
                    ? "rotate-arrow"
                    : ""
                }
              />

            </button>


            {/* ================= FARM FIELDS ================= */}

            {showFarmInfo && (

              <div className="farm-dropdown-content">

                <div className="signup-grid">

                  {/* STATE */}

                  <div className="signup-field">

                    <label>State</label>

                    <div className="signup-input">

                      <MapPin size={16} />

                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="e.g. Bihar"
                      />

                    </div>

                  </div>


                  {/* DISTRICT */}

                  <div className="signup-field">

                    <label>District</label>

                    <div className="signup-input">

                      <MapPin size={16} />

                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="e.g. Patna"
                      />

                    </div>

                  </div>


                  {/* VILLAGE */}

                  <div className="signup-field">

                    <label>Village / Town</label>

                    <div className="signup-input">

                      <MapPin size={16} />

                      <input
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        placeholder="Enter village or town"
                      />

                    </div>

                  </div>


                  {/* FARM SIZE */}

                  <div className="signup-field">

                    <label>Farm Size</label>

                    <div className="signup-input">

                      <LandPlot size={16} />

                      <input
                        type="number"
                        name="farmSize"
                        value={formData.farmSize}
                        onChange={handleChange}
                        placeholder="Farm area"
                        min="0"
                        step="0.01"
                      />

                      <span className="input-unit">
                        acres
                      </span>

                    </div>

                  </div>


                  {/* SOIL */}

                  <div className="signup-field">

                    <label>Soil Type</label>

                    <div className="signup-input">

                      <Sprout size={16} />

                      <select
                        name="soilType"
                        value={formData.soilType}
                        onChange={handleChange}
                      >

                        <option value="">
                          Select soil type
                        </option>

                        <option value="Alluvial">
                          Alluvial
                        </option>

                        <option value="Black">
                          Black Soil
                        </option>

                        <option value="Red">
                          Red Soil
                        </option>

                        <option value="Loamy">
                          Loamy
                        </option>

                        <option value="Sandy">
                          Sandy
                        </option>

                        <option value="Clay">
                          Clay
                        </option>

                        <option value="Laterite">
                          Laterite
                        </option>

                      </select>

                    </div>

                  </div>


                  {/* IRRIGATION */}

                  <div className="signup-field">

                    <label>
                      Irrigation Method
                    </label>

                    <div className="signup-input">

                      <Droplets size={16} />

                      <select
                        name="irrigation"
                        value={formData.irrigation}
                        onChange={handleChange}
                      >

                        <option value="">
                          Select irrigation
                        </option>

                        <option value="Rainfed">
                          Rainfed
                        </option>

                        <option value="Drip">
                          Drip Irrigation
                        </option>

                        <option value="Sprinkler">
                          Sprinkler
                        </option>

                        <option value="Canal">
                          Canal
                        </option>

                        <option value="Tube Well">
                          Tube Well
                        </option>

                      </select>

                    </div>

                  </div>


                  {/* MAIN CROP */}

                  <div className="signup-field signup-full">

                    <label>
                      Main Crop
                    </label>

                    <div className="signup-input">

                      <Sprout size={16} />

                      <input
                        type="text"
                        name="mainCrop"
                        value={formData.mainCrop}
                        onChange={handleChange}
                        placeholder="e.g. Rice, Wheat, Maize"
                      />

                    </div>

                  </div>

                </div>

              </div>

            )}

          </div>


          {/* ================= SUBMIT ================= */}

          <button
            type="submit"
            className="signup-btn"
            disabled={loading}
          >

            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Create Account
                <ArrowRight size={17} />
              </>
            )}

          </button>

        </form>


        {/* ================= LOGIN ================= */}

        <div className="signup-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Signup;