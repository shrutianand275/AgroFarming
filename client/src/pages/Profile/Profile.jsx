import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Sprout,
  LandPlot,
  Droplets,
  Save,
  Edit3
} from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";
import { getProfile, updateProfile } from "../../services/api";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    village: "",
    farmSize: "",
    soilType: "",
    irrigation: "",
    mainCrop: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getProfile();

      if (response.success) {
        const user = response.user;

        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          state: user.state || "",
          district: user.district || "",
          village: user.village || "",
          farmSize: user.farmSize || "",
          soilType: user.soilType || "",
          irrigation: user.irrigation || "",
          mainCrop: user.mainCrop || ""
        });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Unable to load profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ================= PHONE VALIDATION =================

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError("Enter a valid 10-digit mobile number.");
      setMessage("");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        state: formData.state,
        district: formData.district,
        village: formData.village,
        farmSize: formData.farmSize,
        soilType: formData.soilType,
        irrigation: formData.irrigation,
        mainCrop: formData.mainCrop
      });

      if (response.success) {
        setMessage("Profile updated successfully.");

        localStorage.setItem(
          "agroUser",
          JSON.stringify(response.user)
        );
      } else {
        setError(
          response.message || "Unable to update profile."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="profile-loading">
          Loading profile...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="profile-page">

        {/* ================= HEADER ================= */}

        <div className="profile-header">

          <div className="profile-avatar">
            <User size={30} />
          </div>

          <div>
            <h1>My Profile</h1>
            <p>Manage your personal and farming information</p>
          </div>

          <div className="profile-edit-icon">
            <Edit3 size={19} />
          </div>

        </div>


        {/* ================= PROFILE CARD ================= */}

        <div className="profile-card">

          <form onSubmit={handleSubmit}>

            {/* ================= PERSONAL INFORMATION ================= */}

            <div className="profile-section">

              <div className="section-heading">
                <User size={19} />
                <h2>Personal Information</h2>
              </div>

              <div className="profile-grid">

                {/* NAME */}

                <div className="profile-field">

                  <label>Full Name</label>

                  <div className="profile-input">

                    <User size={17} />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />

                  </div>

                </div>


                {/* EMAIL */}

                <div className="profile-field">

                  <label>Email Address</label>

                  <div className="profile-input disabled">

                    <Mail size={17} />

                    <input
                      type="email"
                      value={formData.email}
                      disabled
                    />

                  </div>

                  <small>Email cannot be changed</small>

                </div>


                {/* PHONE */}

                <div className="profile-field">

                  <label>Phone Number</label>

                  <div className="profile-input">

                    <Phone size={17} />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => {

                        const value =
                          e.target.value.replace(/\D/g, "");

                        if (value.length <= 10) {
                          setFormData({
                            ...formData,
                            phone: value
                          });
                        }

                        setMessage("");
                        setError("");

                      }}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      required
                    />

                  </div>

                </div>

              </div>

            </div>


            {/* ================= FARM LOCATION ================= */}

            <div className="profile-section">

              <div className="section-heading">
                <MapPin size={19} />
                <h2>Farm Location</h2>
              </div>

              <div className="profile-grid">

                {/* STATE */}

                <div className="profile-field">

                  <label>State</label>

                  <div className="profile-input">

                    <MapPin size={17} />

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

                <div className="profile-field">

                  <label>District</label>

                  <div className="profile-input">

                    <MapPin size={17} />

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

                <div className="profile-field">

                  <label>Village / Town</label>

                  <div className="profile-input">

                    <MapPin size={17} />

                    <input
                      type="text"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      placeholder="Enter village or town"
                    />

                  </div>

                </div>

              </div>

            </div>


            {/* ================= FARM INFORMATION ================= */}

            <div className="profile-section">

              <div className="section-heading">
                <Sprout size={19} />
                <h2>Farm Information</h2>
              </div>

              <div className="profile-grid">

                {/* FARM SIZE */}

                <div className="profile-field">

                  <label>Farm Size</label>

                  <div className="profile-input">

                    <LandPlot size={17} />

                    <input
                      type="number"
                      name="farmSize"
                      value={formData.farmSize}
                      onChange={handleChange}
                      placeholder="Farm area"
                      min="0"
                      step="0.01"
                    />

                    <span>acres</span>

                  </div>

                </div>


                {/* SOIL TYPE */}

                <div className="profile-field">

                  <label>Soil Type</label>

                  <div className="profile-input">

                    <Sprout size={17} />

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

                <div className="profile-field">

                  <label>Irrigation Method</label>

                  <div className="profile-input">

                    <Droplets size={17} />

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

                <div className="profile-field">

                  <label>Main Crop</label>

                  <div className="profile-input">

                    <Sprout size={17} />

                    <input
                      type="text"
                      name="mainCrop"
                      value={formData.mainCrop}
                      onChange={handleChange}
                      placeholder="e.g. Rice, Wheat"
                    />

                  </div>

                </div>

              </div>

            </div>


            {/* ================= MESSAGE ================= */}

            {message && (
              <div className="profile-success">
                ✓ {message}
              </div>
            )}

            {error && (
              <div className="profile-error">
                {error}
              </div>
            )}


            {/* ================= SAVE ================= */}

            <div className="profile-bottom">

              <button
                type="submit"
                className="profile-save"
                disabled={saving}
              >

                <Save size={17} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>

          </form>

        </div>

      </div>
    </>
  );
}

export default Profile;