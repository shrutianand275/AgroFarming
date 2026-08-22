import React, { useState } from "react";
import axios from "axios";

import {
  Sprout,
  CalendarDays,
  MapPin,
  Mountain,
  CloudRain,
  FlaskConical,
  SprayCan,
  Thermometer,
  Droplets,
  Lightbulb,
  BarChart3
} from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";
import "./YieldPrediction.css";


const crops = [
  "Rice",
  "Wheat",
  "Maize",
  "Cotton",
  "Sugarcane",
  "Barley",
  "Millets",
  "Pulses",
  "Ground Nuts"
];

const seasons = [
  "Kharif",
  "Rabi",
  "Zaid"
];

const states = [
  "Andhra Pradesh",
  "Bihar",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Uttar Pradesh",
  "West Bengal"
];

const irrigationTypes = [
  "Rainfed",
  "Canal",
  "Well",
  "Tube Well",
  "Drip",
  "Sprinkler"
];

const soilTypes = [
  "Sandy",
  "Loamy",
  "Black",
  "Red",
  "Clayey"
];


export default function YieldPrediction() {

  const [formData, setFormData] = useState({
    crop: "",
    season: "",
    state: "",
    area: "",
    rainfall: "",
    fertilizer: "",
    pesticide: "",
    temperature: "",
    irrigation: "",
    soilType: ""
  });

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");


  /* =====================================================
     HANDLE INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  };


  /* =====================================================
     CATEGORY COLOR
  ===================================================== */

  const getCategoryColor = (category) => {

    switch (category) {

      case "Low":
        return "#ef4444";

      case "Medium":
        return "#f59e0b";

      case "High":
        return "#10b981";

      case "Excellent":
        return "#059669";

      default:
        return "#159447";
    }

  };


  /* =====================================================
     HANDLE SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setResult(null);
    setError("");

    try {

      const response = await axios.post(
        "http://localhost:5000/api/yield/predict",
        {
          crop: formData.crop,
          season: formData.season,
          state: formData.state,

          area: Number(formData.area),

          rainfall: Number(formData.rainfall),

          fertilizer: Number(formData.fertilizer),

          pesticide: Number(formData.pesticide),

          temperature: Number(formData.temperature),

          irrigation: formData.irrigation,

          soil_type: formData.soilType
        }
      );


      if (response.data.success) {

        setResult(response.data.data);

      } else {

        setError(
          response.data.message ||
          "Unable to predict crop yield."
        );

      }

    } catch (err) {

      console.error(
        "Yield prediction error:",
        err
      );

      setError(
        "Unable to connect to server. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  return (
    <>
      <Navbar />

      <main className="yield-page">

        <div className="yield-container">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="yield-header">

            <h1 className="yield-title">

              <span className="yield-title-icon">
                <BarChart3 />
              </span>

              AI Yield Prediction

            </h1>

            <p className="yield-subtitle">
              Predict crop yield based on farming conditions and inputs
            </p>

          </div>


          {/* =================================================
              IMPORTANT ALERT
          ================================================= */}

          <div className="yield-alert">

            <strong>
              Important
            </strong>

            <span>
              Enter accurate farming data to get precise yield
              predictions and recommendations for improving crop
              production.
            </span>

          </div>


          {/* =================================================
              FORM CARD
          ================================================= */}

          <div className="yield-card">

            <form
              className="yield-form"
              onSubmit={handleSubmit}
            >

              <div className="yield-grid">


                {/* ================= CROP ================= */}

                <div className="yield-field">

                  <label>
                    <Sprout />
                    <span>Crop</span>
                  </label>

                  <select
                    name="crop"
                    value={formData.crop}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Crop
                    </option>

                    {crops.map((crop) => (

                      <option
                        key={crop}
                        value={crop}
                      >
                        {crop}
                      </option>

                    ))}

                  </select>

                </div>


                {/* ================= SEASON ================= */}

                <div className="yield-field">

                  <label>
                    <CalendarDays />
                    <span>Season</span>
                  </label>

                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Season
                    </option>

                    {seasons.map((season) => (

                      <option
                        key={season}
                        value={season}
                      >
                        {season}
                      </option>

                    ))}

                  </select>

                </div>


                {/* ================= STATE ================= */}

                <div className="yield-field">

                  <label>
                    <MapPin />
                    <span>State</span>
                  </label>

                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select State
                    </option>

                    {states.map((state) => (

                      <option
                        key={state}
                        value={state}
                      >
                        {state}
                      </option>

                    ))}

                  </select>

                </div>


                {/* ================= AREA ================= */}

                <div className="yield-field">

                  <label>
                    <Mountain />
                    <span>Area (hectares)</span>
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. 2.5"
                    required
                  />

                </div>


                {/* ================= RAINFALL ================= */}

                <div className="yield-field">

                  <label>
                    <CloudRain />
                    <span>Annual Rainfall (mm)</span>
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="rainfall"
                    value={formData.rainfall}
                    onChange={handleChange}
                    placeholder="e.g. 1200"
                    required
                  />

                </div>


                {/* ================= FERTILIZER ================= */}

                <div className="yield-field">

                  <label>
                    <FlaskConical />
                    <span>Fertilizer Used (kg)</span>
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="fertilizer"
                    value={formData.fertilizer}
                    onChange={handleChange}
                    placeholder="e.g. 180"
                    required
                  />

                </div>


                {/* ================= PESTICIDE ================= */}

                <div className="yield-field">

                  <label>
                    <SprayCan />
                    <span>Pesticide Used (kg)</span>
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="pesticide"
                    value={formData.pesticide}
                    onChange={handleChange}
                    placeholder="e.g. 5.2"
                    required
                  />

                </div>


                {/* ================= TEMPERATURE ================= */}

                <div className="yield-field">

                  <label>
                    <Thermometer />
                    <span>Avg Temperature (°C)</span>
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="e.g. 28"
                    required
                  />

                </div>


                {/* ================= IRRIGATION ================= */}

                <div className="yield-field">

                  <label>
                    <Droplets />
                    <span>Irrigation</span>
                  </label>

                  <select
                    name="irrigation"
                    value={formData.irrigation}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Irrigation
                    </option>

                    {irrigationTypes.map((item) => (

                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>

                    ))}

                  </select>

                </div>


                {/* ================= SOIL TYPE ================= */}

                <div className="yield-field">

                  <label>
                    <Mountain />
                    <span>Soil Type</span>
                  </label>

                  <select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Soil Type
                    </option>

                    {soilTypes.map((soil) => (

                      <option
                        key={soil}
                        value={soil}
                      >
                        {soil}
                      </option>

                    ))}

                  </select>

                </div>

              </div>


              {/* =================================================
                  BUTTON
              ================================================= */}

              <div className="yield-action">

                <button
                  type="submit"
                  className="yield-btn"
                  disabled={loading}
                >

                  {loading
                    ? "Predicting..."
                    : "Predict Yield"
                  }

                </button>

              </div>

            </form>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (

            <div className="yield-loading">

              <div className="spinner-border text-success" />

              <span>
                Predicting...
              </span>

            </div>

          )}


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="yield-error">
              {error}
            </div>

          )}


          {/* =================================================
              RESULT
          ================================================= */}

          {result && (

            <div className="result-card">


              {/* ================= RESULT HEADER ================= */}

              <div className="result-header">

                <BarChart3 className="result-icon" />

                <h4>
                  Yield Prediction Result
                </h4>

              </div>


              {/* ================= RESULT BODY ================= */}

              <div className="result-body">


                {/* ================= PREDICTED YIELD ================= */}

                <div className="result-item highlight">

                  <Sprout className="item-icon" />

                  <div>

                    <h5>
                      Predicted Yield
                    </h5>

                    <p className="result-value">

                      {result.predicted_yield}

                      {" kg/hectare"}

                    </p>

                  </div>

                </div>


                {/* ================= TOTAL PRODUCTION ================= */}

                <div className="result-item">

                  <BarChart3 className="item-icon" />

                  <div>

                    <h5>
                      Total Production
                    </h5>

                    <p className="result-value">

                      {Number(
                        result.total_production
                      ).toLocaleString()}

                      {" kg"}

                    </p>

                  </div>

                </div>


                {/* ================= YIELD CATEGORY ================= */}

                <div className="result-item">

                  <BarChart3 className="item-icon" />

                  <div>

                    <h5>
                      Yield Category
                    </h5>

                    <p
                      className="result-value"
                      style={{
                        color: getCategoryColor(
                          result.yield_category
                        )
                      }}
                    >

                      {result.yield_category}

                    </p>

                  </div>

                </div>


                {/* ================= RECOMMENDATIONS ================= */}

                <div className="result-item">

                  <Lightbulb className="item-icon" />

                  <div>

                    <h5>
                      Recommendations
                    </h5>


                    {/* English / Hindi object response */}

                    {result.recommendations &&
                    typeof result.recommendations === "object" ? (

                      <ul className="tips-list">

                        {(
                          result.recommendations.en ||
                          result.recommendations.hi ||
                          []
                        ).map(
                          (tip, index) => (

                            <li key={index}>
                              {tip}
                            </li>

                          )
                        )}

                      </ul>

                    ) : Array.isArray(
                      result.recommendations
                    ) ? (

                      <ul className="tips-list">

                        {result.recommendations.map(
                          (tip, index) => (

                            <li key={index}>
                              {tip}
                            </li>

                          )
                        )}

                      </ul>

                    ) : (

                      <p className="result-text">
                        No recommendations available.
                      </p>

                    )}

                  </div>

                </div>


              </div>

            </div>

          )}

        </div>

      </main>

    </>
  );
}