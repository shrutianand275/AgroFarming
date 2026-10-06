import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar/Navbar";
import { predictDisease } from "../../services/api";

import "./DiseasePrediction.css";


/* =====================================================
   COMPONENT
===================================================== */

const DiseasePrediction = () => {

  const { t, i18n } = useTranslation();

  const isHindi = String(i18n.language || "en")
    .toLowerCase()
    .startsWith("hi");


  /* =====================================================
     FORM DATA
  ===================================================== */

  const [formData, setFormData] = useState({
    plant: "",
    temperature: "",
    humidity: "",
    season: "",
    severity: "Moderate"
  });


  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");


  /* =====================================================
     PLANTS
  ===================================================== */

  const plants = [
    "Tomato",
    "Potato",
    "Rice",
    "Wheat",
    "Maize",
    "Cotton",
    "Sugarcane",
    "Grape",
    "Apple",
    "Mango",
    "Banana",
    "Chili",
    "Soybean",
    "Groundnut",
    "Onion"
  ];


  /* =====================================================
     SEASONS
  ===================================================== */

  const seasons = [
    "All Seasons",
    "Monsoon",
    "Summer",
    "Winter",
    "Spring"
  ];


  /* =====================================================
     SEVERITIES
  ===================================================== */

  const severities = [
    "Low",
    "Moderate",
    "High"
  ];


  /* =====================================================
     PLANT TRANSLATION
  ===================================================== */

  const plantHindi = {

    Tomato: "टमाटर",
    Potato: "आलू",
    Rice: "धान",
    Wheat: "गेहूं",
    Maize: "मक्का",
    Cotton: "कपास",
    Sugarcane: "गन्ना",
    Grape: "अंगूर",
    Apple: "सेब",
    Mango: "आम",
    Banana: "केला",
    Chili: "मिर्च",
    Soybean: "सोयाबीन",
    Groundnut: "मूंगफली",
    Onion: "प्याज"

  };


  /* =====================================================
     SEASON TRANSLATION
  ===================================================== */

  const seasonHindi = {

    "All Seasons": "सभी मौसम",
    Monsoon: "मानसून",
    Summer: "गर्मी",
    Winter: "सर्दी",
    Spring: "वसंत"

  };


  /* =====================================================
     SEVERITY TRANSLATION
  ===================================================== */

  const severityHindi = {

    Low: "कम",
    Moderate: "मध्यम",
    High: "अधिक"

  };


  /* =====================================================
     DISEASE TRANSLATION
  ===================================================== */

  const diseaseHindi = {

    Smut: "स्मट (कंडुआ रोग)",

    "Rice Smut":
      "धान का कंडुआ रोग",

    "Wheat Smut":
      "गेहूं का कंडुआ रोग",

    "Maize Smut":
      "मक्का का कंडुआ रोग",

    "Corn Smut":
      "मक्का का कंडुआ रोग",

    "Early Blight":
      "अर्ली ब्लाइट",

    "Late Blight":
      "लेट ब्लाइट",

    "Leaf Blight":
      "लीफ ब्लाइट",

    "Leaf Spot":
      "पत्ती धब्बा रोग",

    "Bacterial Blight":
      "बैक्टीरियल ब्लाइट",

    "Powdery Mildew":
      "पाउडरी मिल्ड्यू",

    "Downy Mildew":
      "डाउनी मिल्ड्यू",

    Anthracnose:
      "एन्थ्रेक्नोज",

    Rust:
      "रस्ट रोग",

    "Black Rot":
      "ब्लैक रॉट",

    "Root Rot":
      "जड़ सड़न रोग",

    "Mosaic Virus":
      "मोज़ेक वायरस रोग",

    "Leaf Curl Virus":
      "लीफ कर्ल वायरस रोग"

  };


  /* =====================================================
     SYMPTOMS TRANSLATION
  ===================================================== */

  const symptomsHindi = {

    "Black whip-like structure from growing point":
      "वृद्धि बिंदु से काले चाबुक जैसी संरचना दिखाई देती है।",

    "Black whip-like structure from the growing point":
      "वृद्धि बिंदु से काले चाबुक जैसी संरचना दिखाई देती है।",

    "Yellowing of leaves":
      "पत्तियों का पीला पड़ना।",

    "Yellowing leaves":
      "पत्तियों का पीला पड़ना।",

    "Brown spots on leaves":
      "पत्तियों पर भूरे धब्बे दिखाई देना।",

    "Dark spots on leaves":
      "पत्तियों पर गहरे धब्बे दिखाई देना।",

    "Wilting of leaves":
      "पत्तियों का मुरझाना।",

    "Leaves become yellow":
      "पत्तियाँ पीली हो जाती हैं।",

    "Leaf discoloration":
      "पत्तियों का रंग बदलना।",

    "Stunted growth":
      "पौधे की वृद्धि रुक जाना।"

  };


  /* =====================================================
     TREATMENT TRANSLATION
  ===================================================== */

  const treatmentHindi = {

    "Remove and burn whips":
      "प्रभावित चाबुक जैसी संरचनाओं को हटाकर जला दें।",

    "Remove and burn infected parts":
      "संक्रमित भागों को हटाकर जला दें।",

    "Remove infected plants":
      "संक्रमित पौधों को हटा दें।",

    "Apply appropriate fungicide":
      "उचित फफूंदनाशी का प्रयोग करें।",

    "Apply suitable fungicide":
      "उपयुक्त फफूंदनाशी का प्रयोग करें।",

    "Use recommended fungicide":
      "अनुशंसित फफूंदनाशी का उपयोग करें।",

    "Use fungicides":
      "फफूंदनाशी का उपयोग करें।"

  };


  /* =====================================================
     PREVENTION TRANSLATION
  ===================================================== */

  const preventionHindi = {

    "Use resistant varieties":
      "रोग प्रतिरोधी किस्मों का उपयोग करें।",

    "Use resistant varieties.":
      "रोग प्रतिरोधी किस्मों का उपयोग करें।",

    "Maintain proper field hygiene":
      "खेत की उचित स्वच्छता बनाए रखें।",

    "Maintain proper field hygiene.":
      "खेत की उचित स्वच्छता बनाए रखें।",

    "Remove infected plants":
      "संक्रमित पौधों को हटा दें।",

    "Avoid excessive moisture":
      "अत्यधिक नमी से बचें।",

    "Ensure proper drainage":
      "उचित जल निकासी सुनिश्चित करें।"

  };


  /* =====================================================
     TRANSLATION HELPER
  ===================================================== */

  const translateValue = (value, dictionary) => {

    if (!value) {
      return "";
    }

    if (!isHindi) {
      return value;
    }

    const original = String(value).trim();

    return dictionary[original] || original;

  };


  /* =====================================================
     HANDLE CHANGE
  ===================================================== */

  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    setError("");

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

      const currentLanguage =
        localStorage.getItem("i18nextLng") ||
        i18n.language ||
        "en";

      const language =
        currentLanguage
          .toLowerCase()
          .startsWith("hi")
          ? "hi"
          : "en";


      const response = await predictDisease({

        Plant: formData.plant,

        Temperature:
          Number(formData.temperature),

        Humidity:
          Number(formData.humidity),

        Season:
          formData.season,

        Severity:
          formData.severity,

        language:
          language

      });


      if (response.success) {

        setResult(response.data);

      } else {

        setError(
          response.message ||
          t("disease.predictionError")
        );

      }

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        t("disease.serverError")
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


      <section className="disease-page">

        <div className="container disease-container">


          {/* HEADER */}

          <div className="text-center disease-header">

            <h6 className="disease-title">
              {t("disease.title")}
            </h6>

            <p className="disease-subtitle">
              {t("disease.subtitle")}
            </p>

          </div>


          {/* INFO */}

          <div className="alert alert-info disease-alert">

            <strong>
              {t("disease.noteTitle")}
            </strong>

            <br />

            {t("disease.note")}

          </div>


          {/* FORM */}

          <div className="card disease-card shadow-sm border-0">

            <div className="card-body disease-card-body">

              <form onSubmit={handleSubmit}>

                <div className="disease-grid">


                  {/* PLANT */}

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

                      <option value="">
                        {t("disease.selectPlant")}
                      </option>


                      {plants.map((plant) => (

                        <option
                          key={plant}
                          value={plant}
                        >

                          {isHindi
                            ? plantHindi[plant]
                            : plant}

                        </option>

                      ))}

                    </select>

                  </div>


                  {/* TEMPERATURE */}

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
                      placeholder={t(
                        "disease.temperaturePlaceholder"
                      )}
                      required
                    />

                  </div>


                  {/* HUMIDITY */}

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
                      placeholder={t(
                        "disease.humidityPlaceholder"
                      )}
                      required
                    />

                  </div>


                  {/* SEASON */}

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

                      <option value="">
                        {t("disease.selectSeason")}
                      </option>

                      {seasons.map((season) => (

                        <option
                          key={season}
                          value={season}
                        >

                          {isHindi
                            ? seasonHindi[season]
                            : season}

                        </option>

                      ))}

                    </select>

                  </div>


                  {/* SEVERITY */}

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

                      {severities.map((severity) => (

                        <option
                          key={severity}
                          value={severity}
                        >

                          {isHindi
                            ? severityHindi[severity]
                            : severity}

                        </option>

                      ))}

                    </select>

                  </div>


                </div>


                {/* BUTTON */}

                <div className="predict-action">

                  <button
                    type="submit"
                    className="predict-btn"
                    disabled={loading}
                  >

                    🔍{" "}

                    {loading
                      ? t("disease.predicting")
                      : t("disease.predict")
                    }

                  </button>

                </div>

              </form>

            </div>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="text-center disease-loading">

              <div
                className="spinner-border text-success"
                role="status"
              />

              <h6 className="mt-2">
                {t("disease.predicting")}
              </h6>

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="alert alert-danger mt-3">
              {error}
            </div>

          )}


          {/* =================================================
              RESULT
          ================================================= */}

          {result && (

            <div className="result-card mt-4">


              {/* RESULT HEADER */}

              <div className="result-header">

                <span className="result-icon">
                  🦠
                </span>

                <h4>
                  {t("disease.result")}
                </h4>

              </div>


              <div className="result-body">


                {/* DISEASE */}

                <div className="result-item highlight">

                  <span className="item-icon">
                    🔬
                  </span>

                  <div>

                    <h5>
                      {t("disease.diseaseIdentified")}
                    </h5>

                    <p className="result-value">

                      {translateValue(
                        result.disease,
                        diseaseHindi
                      )}

                    </p>

                    <p
                      style={{
                        fontSize: "0.8rem",
                        marginTop: "4px"
                      }}
                    >

                      {t("disease.confidence")}:{" "}

                      {result.confidence}%

                    </p>

                  </div>

                </div>


                {/* SEVERITY */}

                <div className="result-item">

                  <span className="item-icon">
                    ⚠️
                  </span>

                  <div>

                    <h5>
                      {t("disease.severityLevel")}
                    </h5>

                    <p>

                      {translateValue(
                        result.severity,
                        severityHindi
                      )}

                    </p>

                  </div>

                </div>


                {/* SYMPTOMS */}

                <div className="result-item">

                  <span className="item-icon">
                    📋
                  </span>

                  <div>

                    <h5>
                      {t("disease.symptoms")}
                    </h5>

                    <p>

                      {translateValue(
                        result.symptoms,
                        symptomsHindi
                      )}

                    </p>

                  </div>

                </div>


                {/* TREATMENT */}

                <div className="result-item">

                  <span className="item-icon">
                    💊
                  </span>

                  <div>

                    <h5>
                      {t("disease.treatment")}
                    </h5>

                    <p>

                      {translateValue(
                        result.treatment,
                        treatmentHindi
                      )}

                    </p>

                  </div>

                </div>


                {/* PREVENTION */}

                <div className="result-item">

                  <span className="item-icon">
                    🛡️
                  </span>

                  <div>

                    <h5>
                      {t("disease.prevention")}
                    </h5>

                    <p>

                      {translateValue(
                        result.prevention,
                        preventionHindi
                      )}

                    </p>

                  </div>

                </div>


                {/* CONDITIONS */}

                <div className="result-item">

                  <span className="item-icon">
                    🌡️
                  </span>

                  <div>

                    <h5>
                      {t("disease.conditions")}
                    </h5>

                    <p>

                      <strong>
                        {t("disease.temperature")}:
                      </strong>{" "}

                      {result.temperature_range}°C

                      <br />


                      <strong>
                        {t("disease.humidity")}:
                      </strong>{" "}

                      {result.humidity_range}%

                      <br />


                      <strong>
                        {t("disease.season")}:
                      </strong>{" "}

                      {translateValue(
                        result.season,
                        seasonHindi
                      )}

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