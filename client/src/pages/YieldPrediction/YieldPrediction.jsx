import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { predictYield } from "../../services/api";

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


/* =====================================================
   CROP VALUES
===================================================== */

const crops = [
  "Bajra",
  "Cotton",
  "Groundnut",
  "Jute",
  "Maize",
  "Pulses",
  "Rice",
  "Soybean",
  "Sugarcane",
  "Wheat"
];


/* =====================================================
   SEASON VALUES
===================================================== */

const seasons = [
  "Kharif",
  "Rabi",
  "Year-round"
];


/* =====================================================
   STATE VALUES
===================================================== */

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


/* =====================================================
   IRRIGATION VALUES
===================================================== */

const irrigationTypes = [
  "Yes",
  "No"
];


/* =====================================================
   SOIL VALUES
===================================================== */

const soilTypes = [
  "Sandy",
  "Loamy",
  "Black",
  "Red",
  "Clayey"
];


/* =====================================================
   HINDI DISPLAY NAMES
===================================================== */

const cropHindiNames = {
  "Bajra": "बाजरा",
  "Cotton": "कपास",
  "Groundnut": "मूंगफली",
  "Jute": "जूट",
  "Maize": "मक्का",
  "Pulses": "दलहन",
  "Rice": "धान",
  "Soybean": "सोयाबीन",
  "Sugarcane": "गन्ना",
  "Wheat": "गेहूं"
};


const seasonHindiNames = {
  "Kharif": "खरीफ",
  "Rabi": "रबी",
  "Year-round": "पूरे वर्ष"
};


const stateHindiNames = {
  "Andhra Pradesh": "आंध्र प्रदेश",
  "Bihar": "बिहार",
  "Gujarat": "गुजरात",
  "Haryana": "हरियाणा",
  "Karnataka": "कर्नाटक",
  "Madhya Pradesh": "मध्य प्रदेश",
  "Maharashtra": "महाराष्ट्र",
  "Punjab": "पंजाब",
  "Rajasthan": "राजस्थान",
  "Tamil Nadu": "तमिलनाडु",
  "Uttar Pradesh": "उत्तर प्रदेश",
  "West Bengal": "पश्चिम बंगाल"
};


const soilHindiNames = {
  "Sandy": "रेतीली मिट्टी",
  "Loamy": "दोमट मिट्टी",
  "Black": "काली मिट्टी",
  "Red": "लाल मिट्टी",
  "Clayey": "चिकनी मिट्टी"
};


const irrigationHindiNames = {
  "Yes": "हाँ",
  "No": "नहीं"
};


/* =====================================================
   YIELD CATEGORY HINDI
===================================================== */

const yieldCategoryHindiNames = {
  "Low": "कम",
  "Medium": "मध्यम",
  "High": "अधिक",
  "Excellent": "उत्कृष्ट"
};


/* =====================================================
   COMPONENT
===================================================== */

export default function YieldPrediction() {

  const { t, i18n } = useTranslation();

  const language = String(i18n.language || "en")
    .toLowerCase();

  const isHindi = language.startsWith("hi");


  /* =====================================================
     FORM DATA
  ===================================================== */

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
     DISPLAY HELPERS
  ===================================================== */

  const getCropName = (crop) => {

    if (!isHindi) {
      return crop;
    }

    return cropHindiNames[crop] || crop;
  };


  const getSeasonName = (season) => {

    if (!isHindi) {
      return season;
    }

    return seasonHindiNames[season] || season;
  };


  const getStateName = (state) => {

    if (!isHindi) {
      return state;
    }

    return stateHindiNames[state] || state;
  };


  const getSoilName = (soil) => {

    if (!isHindi) {
      return soil;
    }

    return soilHindiNames[soil] || soil;
  };


  const getIrrigationName = (item) => {

    if (!isHindi) {
      return item;
    }

    return irrigationHindiNames[item] || item;
  };


  const getYieldCategoryName = (category) => {

    if (!category) {
      return "";
    }

    if (!isHindi) {
      return category;
    }

    return yieldCategoryHindiNames[category] || category;
  };


  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    setError("");
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

      /* ================================================
         VALIDATE NUMERIC VALUES
      ================================================= */

      const area = Number(formData.area);
      const rainfall = Number(formData.rainfall);
      const fertilizer = Number(formData.fertilizer);
      const pesticide = Number(formData.pesticide);
      const temperature = Number(formData.temperature);


      if (area <= 0) {

        setError(
          t("yield.areaError")
        );

        setLoading(false);

        return;
      }


      if (rainfall < 0) {

        setError(
          t("yield.rainfallError")
        );

        setLoading(false);

        return;
      }


      if (fertilizer < 0) {

        setError(
          t("yield.fertilizerError")
        );

        setLoading(false);

        return;
      }


      if (pesticide < 0) {

        setError(
          t("yield.pesticideError")
        );

        setLoading(false);

        return;
      }


      /* ================================================
         SEND TO BACKEND
      ================================================= */

      const response = await predictYield({

        crop: formData.crop,

        season: formData.season,

        state: formData.state,

        area: area,

        rainfall: rainfall,

        fertilizer: fertilizer,

        pesticide: pesticide,

        temperature: temperature,

        irrigation: formData.irrigation,

        soil_type: formData.soilType

      });


      /* ================================================
         SUCCESS
      ================================================= */

      if (response.success) {

        setResult(response.prediction);

      } else {

        setError(
          response.message ||
          t("yield.predictionError")
        );

      }


    } catch (err) {

      console.error(
        "Yield prediction error:",
        err
      );


      const backendMessage =
        err.response?.data?.message;


      setError(
        backendMessage ||
        t("yield.serverError")
      );


    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     RENDER
  ===================================================== */

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

              {t("yield.title")}

            </h1>


            <p className="yield-subtitle">
              {t("yield.subtitle")}
            </p>

          </div>


          {/* =================================================
              IMPORTANT ALERT
          ================================================= */}

          <div className="yield-alert">

            <strong>
              {t("yield.noteTitle")}
            </strong>

            <span>
              {t("yield.note")}
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

                    <span>
                      {t("yield.crop")}
                    </span>

                  </label>


                  <select
                    name="crop"
                    value={formData.crop}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      {t("yield.selectCrop")}
                    </option>


                    {crops.map((crop) => (

                      <option
                        key={crop}
                        value={crop}
                      >

                        {getCropName(crop)}

                      </option>

                    ))}

                  </select>

                </div>


                {/* ================= SEASON ================= */}

                <div className="yield-field">

                  <label>

                    <CalendarDays />

                    <span>
                      {t("yield.season")}
                    </span>

                  </label>


                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      {t("yield.selectSeason")}
                    </option>


                    {seasons.map((season) => (

                      <option
                        key={season}
                        value={season}
                      >

                        {getSeasonName(season)}

                      </option>

                    ))}

                  </select>

                </div>


                {/* ================= STATE ================= */}

                <div className="yield-field">

                  <label>

                    <MapPin />

                    <span>
                      {t("yield.state")}
                    </span>

                  </label>


                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      {t("yield.selectState")}
                    </option>


                    {states.map((state) => (

                      <option
                        key={state}
                        value={state}
                      >

                        {getStateName(state)}

                      </option>

                    ))}

                  </select>

                </div>


                {/* ================= AREA ================= */}

                <div className="yield-field">

                  <label>

                    <Mountain />

                    <span>
                      {t("yield.area")}
                    </span>

                  </label>


                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder={t("yield.areaPlaceholder")}
                    required
                  />

                </div>


                {/* ================= RAINFALL ================= */}

                <div className="yield-field">

                  <label>

                    <CloudRain />

                    <span>
                      {t("yield.rainfall")}
                    </span>

                  </label>


                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="rainfall"
                    value={formData.rainfall}
                    onChange={handleChange}
                    placeholder={t("yield.rainfallPlaceholder")}
                    required
                  />

                </div>


                {/* ================= FERTILIZER ================= */}

                <div className="yield-field">

                  <label>

                    <FlaskConical />

                    <span>
                      {t("yield.fertilizer")}
                    </span>

                  </label>


                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="fertilizer"
                    value={formData.fertilizer}
                    onChange={handleChange}
                    placeholder={t("yield.fertilizerPlaceholder")}
                    required
                  />

                </div>


                {/* ================= PESTICIDE ================= */}

                <div className="yield-field">

                  <label>

                    <SprayCan />

                    <span>
                      {t("yield.pesticide")}
                    </span>

                  </label>


                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="pesticide"
                    value={formData.pesticide}
                    onChange={handleChange}
                    placeholder={t("yield.pesticidePlaceholder")}
                    required
                  />

                </div>


                {/* ================= TEMPERATURE ================= */}

                <div className="yield-field">

                  <label>

                    <Thermometer />

                    <span>
                      {t("yield.temperature")}
                    </span>

                  </label>


                  <input
                    type="number"
                    step="0.01"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder={t("yield.temperaturePlaceholder")}
                    required
                  />

                </div>


                {/* ================= IRRIGATION ================= */}

                <div className="yield-field">

                  <label>

                    <Droplets />

                    <span>
                      {t("yield.irrigation")}
                    </span>

                  </label>


                  <select
                    name="irrigation"
                    value={formData.irrigation}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      {t("yield.selectIrrigation")}
                    </option>


                    {irrigationTypes.map((item) => (

                      <option
                        key={item}
                        value={item}
                      >

                        {getIrrigationName(item)}

                      </option>

                    ))}

                  </select>

                </div>


                {/* ================= SOIL TYPE ================= */}

                <div className="yield-field">

                  <label>

                    <Mountain />

                    <span>
                      {t("yield.soilType")}
                    </span>

                  </label>


                  <select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      {t("yield.selectSoilType")}
                    </option>


                    {soilTypes.map((soil) => (

                      <option
                        key={soil}
                        value={soil}
                      >

                        {getSoilName(soil)}

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
                    ? t("yield.predicting")
                    : t("yield.predictButton")
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
                {t("yield.predicting")}
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
                  {t("yield.resultTitle")}
                </h4>

              </div>


              {/* ================= RESULT BODY ================= */}

              <div className="result-body">


                {/* ================= PREDICTED YIELD ================= */}

                <div className="result-item highlight">

                  <Sprout className="item-icon" />

                  <div>

                    <h5>
                      {t("yield.predictedYield")}
                    </h5>


                    <p className="result-value">

                      {Number(
                        result.predicted_yield
                      ).toLocaleString()}

                      {" kg/hectare"}

                    </p>

                  </div>

                </div>


                {/* ================= TOTAL PRODUCTION ================= */}

                <div className="result-item">

                  <BarChart3 className="item-icon" />

                  <div>

                    <h5>
                      {t("yield.totalProduction")}
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
                      {t("yield.yieldCategory")}
                    </h5>


                    <p
                      className="result-value"
                      style={{
                        color: getCategoryColor(
                          result.yield_category
                        )
                      }}
                    >

                      {getYieldCategoryName(
                        result.yield_category
                      )}

                    </p>

                  </div>

                </div>


                {/* ================= RECOMMENDATIONS ================= */}

                <div className="result-item">

                  <Lightbulb className="item-icon" />

                  <div>

                    <h5>
                      {t("yield.recommendations")}
                    </h5>


                    {result.recommendations &&
                    typeof result.recommendations === "object" ? (

                      <ul className="tips-list">

                        {(
                          isHindi
                            ? (
                                result.recommendations.hi ||
                                result.recommendations.en ||
                                []
                              )
                            : (
                                result.recommendations.en ||
                                []
                              )
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

                        {t("yield.noRecommendations")}

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