import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
        setError(t("profile.loadError"));
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
      setError(t("profile.phoneError"));
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
        setMessage(t("profile.profileUpdated"));

        localStorage.setItem(
          "agroUser",
          JSON.stringify(response.user)
        );
      } else {
        setError(
          response.message || t("profile.updateError")
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        t("profile.updateError")
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
          {t("profile.loading")}
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
            <h1>{t("profile.title")}</h1>
            <p>{t("profile.subtitle")}</p>
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
                <h2>{t("profile.personalInfo")}</h2>
              </div>

              <div className="profile-grid">

                {/* NAME */}

                <div className="profile-field">

                  <label>{t("profile.fullName")}</label>

                  <div className="profile-input">

                    <User size={17} />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("profile.namePlaceholder")}
                      required
                    />

                  </div>

                </div>


                {/* EMAIL */}

                <div className="profile-field">

                  <label>{t("profile.emailAddress")}</label>

                  <div className="profile-input disabled">

                    <Mail size={17} />

                    <input
                      type="email"
                      value={formData.email}
                      disabled
                    />

                  </div>

                  <small>{t("profile.emailNote")}</small>

                </div>


                {/* PHONE */}

                <div className="profile-field">

                  <label>{t("profile.phoneNumber")}</label>

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
                      placeholder={t("profile.phonePlaceholder")}
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
                <h2>{t("profile.farmLocation")}</h2>
              </div>

              <div className="profile-grid">

                {/* STATE */}

                <div className="profile-field">

                  <label>{t("profile.state")}</label>

                  <div className="profile-input">

                    <MapPin size={17} />

                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder={t("profile.statePlaceholder")}
                    />

                  </div>

                </div>


                {/* DISTRICT */}

                <div className="profile-field">

                  <label>{t("profile.district")}</label>

                  <div className="profile-input">

                    <MapPin size={17} />

                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder={t("profile.districtPlaceholder")}
                    />

                  </div>

                </div>


                {/* VILLAGE */}

                <div className="profile-field">

                  <label>{t("profile.village")}</label>

                  <div className="profile-input">

                    <MapPin size={17} />

                    <input
                      type="text"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      placeholder={t("profile.villagePlaceholder")}
                    />

                  </div>

                </div>

              </div>

            </div>


            {/* ================= FARM INFORMATION ================= */}

            <div className="profile-section">

              <div className="section-heading">
                <Sprout size={19} />
                <h2>{t("profile.farmInfo")}</h2>
              </div>

              <div className="profile-grid">

                {/* FARM SIZE */}

                <div className="profile-field">

                  <label>{t("profile.farmSize")}</label>

                  <div className="profile-input">

                    <LandPlot size={17} />

                    <input
                      type="number"
                      name="farmSize"
                      value={formData.farmSize}
                      onChange={handleChange}
                      placeholder={t("profile.farmSizePlaceholder")}
                      min="0"
                      step="0.01"
                    />

                    <span>{t("profile.acres")}</span>

                  </div>

                </div>


                {/* SOIL TYPE */}

                <div className="profile-field">

                  <label>{t("profile.soilType")}</label>

                  <div className="profile-input">

                    <Sprout size={17} />

                    <select
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleChange}
                    >

                      <option value="">
                        {t("profile.selectSoilType")}
                      </option>

                      <option value="Alluvial">
                        {t("profile.soilTypes.alluvial")}
                      </option>

                      <option value="Black">
                        {t("profile.soilTypes.black")}
                      </option>

                      <option value="Red">
                        {t("profile.soilTypes.red")}
                      </option>

                      <option value="Loamy">
                        {t("profile.soilTypes.loamy")}
                      </option>

                      <option value="Sandy">
                        {t("profile.soilTypes.sandy")}
                      </option>

                      <option value="Clay">
                        {t("profile.soilTypes.clay")}
                      </option>

                      <option value="Laterite">
                        {t("profile.soilTypes.laterite")}
                      </option>

                    </select>

                  </div>

                </div>


                {/* IRRIGATION */}

                <div className="profile-field">

                  <label>{t("profile.irrigation")}</label>

                  <div className="profile-input">

                    <Droplets size={17} />

                    <select
                      name="irrigation"
                      value={formData.irrigation}
                      onChange={handleChange}
                    >

                      <option value="">
                        {t("profile.selectIrrigation")}
                      </option>

                      <option value="Rainfed">
                        {t("profile.irrigationTypes.rainfed")}
                      </option>

                      <option value="Drip">
                        {t("profile.irrigationTypes.drip")}
                      </option>

                      <option value="Sprinkler">
                        {t("profile.irrigationTypes.sprinkler")}
                      </option>

                      <option value="Canal">
                        {t("profile.irrigationTypes.canal")}
                      </option>

                      <option value="Tube Well">
                        {t("profile.irrigationTypes.tubeWell")}
                      </option>

                    </select>

                  </div>

                </div>


                {/* MAIN CROP */}

                <div className="profile-field">

                  <label>{t("profile.mainCrop")}</label>

                  <div className="profile-input">

                    <Sprout size={17} />

                    <input
                      type="text"
                      name="mainCrop"
                      value={formData.mainCrop}
                      onChange={handleChange}
                      placeholder={t("profile.mainCropPlaceholder")}
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
                  ? t("profile.saving")
                  : t("profile.saveChanges")}

              </button>

            </div>

          </form>

        </div>

      </div>
    </>
  );
}

export default Profile;