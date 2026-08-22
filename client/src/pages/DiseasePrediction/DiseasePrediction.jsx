import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar/Navbar";
import { predictDisease } from "../../services/api";
import "./DiseasePrediction.css";

const DiseasePrediction = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    plant: "",
    temperature: "",
    humidity: "",
    season: "",
    severity: "Moderate"
  });

  const plants = [
    "Tomato", "Potato", "Rice", "Wheat", "Maize", "Cotton",
    "Sugarcane", "Grape", "Apple", "Mango", "Banana", "Chili",
    "Soybean", "Groundnut", "Onion"
  ];

  const seasons = ["All Seasons", "Monsoon", "Summer", "Winter", "Spring"];
  const severities = ["Low", "Moderate", "High"];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const currentLanguage = localStorage.getItem('i18nextLng') || 'en';
      const language = currentLanguage.startsWith('hi') ? 'hi' : 'en';

      const response = await predictDisease({
        Plant: formData.plant,
        Temperature: Number(formData.temperature),
        Humidity: Number(formData.humidity),
        Season: formData.season,
        Severity: formData.severity,
        language: language
      });

      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
      setError(t("disease.serverError"));
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <section className="disease-page">
        <div className="container disease-container">
          {/* Header */}
          <div className="text-center disease-header">
            <h6 className="disease-title">
              {t("disease.title")}
            </h6>
            <p className="disease-subtitle">
              {t("disease.subtitle")}
            </p>
          </div>

          {/* Info Alert */}
          <div className="alert alert-info disease-alert">
            <strong>{t("disease.noteTitle")}</strong>
            <br />
            {t("disease.note")}
          </div>

          {/* Form */}
          <div className="card disease-card shadow-sm border-0">
            <div className="card-body disease-card-body">
              <form onSubmit={handleSubmit}>
                <div className="disease-grid">
                  
                  {/* Plant */}
                  <div className="field">
                    <label>
                      🌱 {t("disease.plant")}
                    </label>
                    <select
                      name="plant"
                      value={formData.plant}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">{t("disease.selectPlant")}</option>
                      {plants.map((plant) => (
                        <option key={plant} value={plant}>
                          {plant}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Temperature */}
                  <div className="field">
                    <label>
                      🌡 {t("disease.temperature")}
                    </label>
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. 26"
                      required
                    />
                  </div>

                  {/* Humidity */}
                  <div className="field">
                    <label>
                      💧 {t("disease.humidity")}
                    </label>
                    <input
                      type="number"
                      name="humidity"
                      value={formData.humidity}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. 80"
                      required
                    />
                  </div>

                  {/* Season */}
                  <div className="field">
                    <label>
                      📅 {t("disease.season")}
                    </label>
                    <select
                      name="season"
                      value={formData.season}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">{t("disease.selectSeason")}</option>
                      {seasons.map((season) => (
                        <option key={season} value={season}>
                          {season}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Severity */}
                  <div className="field">
                    <label>
                      ⚠️ {t("disease.severity")}
                    </label>
                    <select
                      name="severity"
                      value={formData.severity}
                      onChange={handleChange}
                      className="form-select"
                    >
                      {severities.map((sev) => (
                        <option key={sev} value={sev}>
                          {sev}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="predict-action">
                  <button type="submit" className="predict-btn">
                    🔍 {t("disease.predict")}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center disease-loading">
              <div className="spinner-border text-success" role="status" />
              <h6 className="mt-2">{t("disease.predicting")}</h6>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert alert-danger mt-3">{error}</div>
          )}

          {/* Result */}
          {result && (
            <div className="result-card mt-4">
              <div className="result-header">
                <span className="result-icon">🦠</span>
                <h4>{t("disease.result")}</h4>
              </div>

              <div className="result-body">
                {/* Disease Name */}
                <div className="result-item highlight">
                  <span className="item-icon">🔬</span>
                  <div>
                    <h5>{t("disease.diseaseIdentified")}</h5>
                    <p className="result-value">{result.disease}</p>
                    <p style={{fontSize: '0.8rem', marginTop: '4px'}}>
                      {t("disease.confidence")}: {result.confidence}%
                    </p>
                  </div>
                </div>

                {/* Severity */}
                <div className="result-item">
                  <span className="item-icon">⚠️</span>
                  <div>
                    <h5>{t("disease.severityLevel")}</h5>
                    <p>{result.severity}</p>
                  </div>
                </div>

                {/* Symptoms */}
                <div className="result-item">
                  <span className="item-icon">📋</span>
                  <div>
                    <h5>{t("disease.symptoms")}</h5>
                    <p>{result.symptoms}</p>
                  </div>
                </div>

                {/* Treatment */}
                <div className="result-item">
                  <span className="item-icon">💊</span>
                  <div>
                    <h5>{t("disease.treatment")}</h5>
                    <p>{result.treatment}</p>
                  </div>
                </div>

                {/* Prevention */}
                <div className="result-item">
                  <span className="item-icon">🛡️</span>
                  <div>
                    <h5>{t("disease.prevention")}</h5>
                    <p>{result.prevention}</p>
                  </div>
                </div>

                {/* Optimal Conditions */}
                <div className="result-item">
                  <span className="item-icon">🌡️</span>
                  <div>
                    <h5>{t("disease.conditions")}</h5>
                    <p>
                      <strong>{t("disease.temperature")}:</strong> {result.temperature_range}°C<br/>
                      <strong>{t("disease.humidity")}:</strong> {result.humidity_range}%<br/>
                      <strong>{t("disease.season")}:</strong> {result.season}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DiseasePrediction;
