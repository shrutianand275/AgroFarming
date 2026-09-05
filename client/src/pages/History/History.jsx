import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sprout,
  FlaskConical,
  Bug,
  Wheat,
  Trash2,
  Clock,
  History as HistoryIcon,
  ChevronDown,
  ChevronUp
} from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";
import API from "../../services/api";
import "./History.css";

function History() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});

  const isHindi = i18n.language === "hi";

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await API.get("/history");

      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError(
          isHindi
            ? "इतिहास लोड नहीं हो सका।"
            : "Unable to load history."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      await API.delete(`/history/${id}`);

      setHistory((previous) =>
        previous.filter((item) => item.id !== id)
      );
    } catch (err) {
      setError(
        isHindi
          ? "इतिहास हटाया नहीं जा सका।"
          : "Unable to delete history."
      );
    }
  };

  const clearHistory = async () => {
    const confirmed = window.confirm(
      isHindi
        ? "क्या आप पूरा इतिहास हटाना चाहते हैं?"
        : "Are you sure you want to clear all history?"
    );

    if (!confirmed) return;

    try {
      await API.delete("/history");
      setHistory([]);
    } catch (err) {
      setError(
        isHindi
          ? "इतिहास साफ नहीं किया जा सका।"
          : "Unable to clear history."
      );
    }
  };

  const toggleExpanded = (id) => {
    setExpanded((previous) => ({
      ...previous,
      [id]: !previous[id]
    }));
  };

  const getIcon = (type) => {
    switch (type) {
      case "crop":
        return <Sprout size={22} />;

      case "fertilizer":
        return <FlaskConical size={22} />;

      case "disease":
        return <Bug size={22} />;

      case "yield":
        return <Wheat size={22} />;

      default:
        return <HistoryIcon size={22} />;
    }
  };

  const getTypeName = (type) => {
    if (isHindi) {
      switch (type) {
        case "crop":
          return "फसल सिफारिश";

        case "fertilizer":
          return "उर्वरक सिफारिश";

        case "disease":
          return "रोग पहचान";

        case "yield":
          return "उपज अनुमान";

        default:
          return "गतिविधि";
      }
    }

    switch (type) {
      case "crop":
        return "Crop Recommendation";

      case "fertilizer":
        return "Fertilizer Recommendation";

      case "disease":
        return "Disease Prediction";

      case "yield":
        return "Yield Prediction";

      default:
        return "Activity";
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString(
      isHindi ? "hi-IN" : "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );
  };

  const formatLabel = (key) => {
    const labels = {
      N: "Nitrogen",
      P: "Phosphorus",
      K: "Potassium",
      ph: "pH",
      temperature: "Temperature",
      humidity: "Humidity",
      rainfall: "Rainfall",
      moisture: "Moisture",
      soilType: "Soil Type",
      cropType: "Crop Type",
      fertilizer: "Fertilizer",
      pesticide: "Pesticide",
      area: "Area",
      season: "Season",
      state: "State",
      irrigation: "Irrigation",
      soil_type: "Soil Type",
      predicted_yield: "Predicted Yield",
      total_production: "Total Production",
      yield_category: "Yield Category",
      confidence: "Confidence"
    };

    return labels[key] || key;
  };

  const formatValue = (key, value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (typeof value === "number") {
      return Number.isInteger(value)
        ? value
        : value.toFixed(2);
    }

    return String(value);
  };

  const getInputEntries = (item) => {
    if (!item.input || typeof item.input !== "object") {
      return [];
    }

    return Object.entries(item.input).filter(
      ([key]) => key !== "language"
    );
  };

  const getResultDetails = (item) => {
    const result = item.result;

    if (!result || typeof result !== "object") {
      return [];
    }

    const excluded = [
      "description",
      "benefits",
      "applicationTips",
      "tips",
      "top3",
      "recommendations"
    ];

    return Object.entries(result).filter(
      ([key]) => !excluded.includes(key)
    );
  };

  const getMainResult = (item) => {
    const result = item.result;

    if (!result) return "";

    if (typeof result === "string") {
      return result;
    }

    if (result.recommended_crop) {
      return result.recommended_crop;
    }

    if (result.fertilizer) {
      return result.fertilizer;
    }

    if (result.disease) {
      return result.disease;
    }

    if (result.predicted_yield !== undefined) {
      return `${result.predicted_yield}`;
    }

    if (result.yield !== undefined) {
      return `${result.yield}`;
    }

    return "";
  };

  const getResultTitle = (type) => {
    if (isHindi) {
      switch (type) {
        case "crop":
          return "सुझाई गई फसल";

        case "fertilizer":
          return "अनुशंसित उर्वरक";

        case "disease":
          return "पहचाना गया रोग";

        case "yield":
          return "अनुमानित उपज";

        default:
          return "परिणाम";
      }
    }

    switch (type) {
      case "crop":
        return "Recommended Crop";

      case "fertilizer":
        return "Recommended Fertilizer";

      case "disease":
        return "Detected Disease";

      case "yield":
        return "Predicted Yield";

      default:
        return "Result";
    }
  };

  return (
    <>
      <Navbar />

      <div className="history-page">

        {/* ================= HEADER ================= */}

        <div className="history-header">

          <div className="history-title">

            <div className="history-icon">
              <HistoryIcon size={27} />
            </div>

            <div>
              <h1>
                {isHindi ? "मेरा इतिहास" : "My History"}
              </h1>

              <p>
                {isHindi
                  ? "अपनी पिछली कृषि गतिविधियों और परिणामों को देखें"
                  : "View your previous farming activities and results"}
              </p>
            </div>

          </div>

          {history.length > 0 && (
            <button
              className="clear-history-btn"
              onClick={clearHistory}
            >
              <Trash2 size={16} />

              {isHindi
                ? "सभी हटाएं"
                : "Clear All"}
            </button>
          )}

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="history-error">
            {error}
          </div>
        )}

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="history-empty">
            <HistoryIcon size={38} />

            <h3>
              {isHindi
                ? "इतिहास लोड हो रहा है..."
                : "Loading history..."}
            </h3>
          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!loading && history.length === 0 && !error && (
          <div className="history-empty">

            <div className="empty-icon">
              <HistoryIcon size={42} />
            </div>

            <h2>
              {isHindi
                ? "अभी कोई इतिहास नहीं है"
                : "No History Yet"}
            </h2>

            <p>
              {isHindi
                ? "आपकी फसल, उर्वरक, रोग और उपज की गतिविधियां यहां दिखाई देंगी।"
                : "Your crop, fertilizer, disease and yield activities will appear here."}
            </p>

          </div>
        )}

        {/* ================= HISTORY LIST ================= */}

        {!loading && history.length > 0 && (
          <div className="history-list">

            {history.map((item) => {

              const isOpen = expanded[item.id];
              const inputEntries = getInputEntries(item);
              const resultDetails = getResultDetails(item);
              const mainResult = getMainResult(item);

              return (
                <div
                  className="history-card"
                  key={item.id}
                >

                  {/* ================= ICON ================= */}

                  <div className={`history-card-icon ${item.type}`}>
                    {getIcon(item.type)}
                  </div>

                  {/* ================= CONTENT ================= */}

                  <div className="history-card-content">

                    {/* TOP */}

                    <div className="history-card-top">

                      <div>
                        <span className="history-type">
                          {getTypeName(item.type)}
                        </span>

                        <h3>
                          {item.title || getTypeName(item.type)}
                        </h3>
                      </div>

                      <button
                        className="delete-history-btn"
                        onClick={() => deleteItem(item.id)}
                        title={
                          isHindi
                            ? "हटाएं"
                            : "Delete"
                        }
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                    {/* ================= MAIN RESULT ================= */}

                    {mainResult && (
                      <div className="history-result">

                        <div>
                          <strong>
                            {getResultTitle(item.type)}
                          </strong>

                          <span>
                            {mainResult}
                          </span>
                        </div>

                      </div>
                    )}

                    {/* ================= DATE ================= */}

                    <div className="history-date">
                      <Clock size={14} />
                      {formatDate(item.created_at)}
                    </div>

                    {/* ================= DETAILS BUTTON ================= */}

                    {(inputEntries.length > 0 ||
                      resultDetails.length > 0) && (

                      <button
                        className="history-details-btn"
                        onClick={() => toggleExpanded(item.id)}
                      >
                        {isOpen
                          ? (
                            <>
                              <ChevronUp size={17} />
                              {isHindi
                                ? "कम विवरण"
                                : "Hide Details"}
                            </>
                          )
                          : (
                            <>
                              <ChevronDown size={17} />
                              {isHindi
                                ? "पूरा विवरण"
                                : "View Details"}
                            </>
                          )}
                      </button>
                    )}

                    {/* ================= EXPANDED DETAILS ================= */}

                    {isOpen && (
                      <div className="history-details">

                        {/* INPUT VALUES */}

                        {inputEntries.length > 0 && (
                          <div className="history-detail-section">

                            <h4>
                              {isHindi
                                ? "इनपुट विवरण"
                                : "Input Details"}
                            </h4>

                            <div className="history-detail-grid">

                              {inputEntries.map(
                                ([key, value]) => (
                                  <div
                                    className="history-detail-item"
                                    key={key}
                                  >
                                    <span>
                                      {formatLabel(key)}
                                    </span>

                                    <strong>
                                      {formatValue(
                                        key,
                                        value
                                      )}
                                    </strong>
                                  </div>
                                )
                              )}

                            </div>

                          </div>
                        )}

                        {/* RESULT DETAILS */}

                        {resultDetails.length > 0 && (
                          <div className="history-detail-section">

                            <h4>
                              {isHindi
                                ? "परिणाम विवरण"
                                : "Result Details"}
                            </h4>

                            <div className="history-detail-grid">

                              {resultDetails.map(
                                ([key, value]) => (
                                  <div
                                    className="history-detail-item"
                                    key={key}
                                  >
                                    <span>
                                      {formatLabel(key)}
                                    </span>

                                    <strong>
                                      {formatValue(
                                        key,
                                        value
                                      )}
                                    </strong>
                                  </div>
                                )
                              )}

                            </div>

                          </div>
                        )}

                        {/* TOP 3 CROPS */}

                        {item.result?.top3 &&
                          Array.isArray(item.result.top3) && (
                            <div className="history-detail-section">

                              <h4>
                                {isHindi
                                  ? "शीर्ष 3 फसलें"
                                  : "Top 3 Recommendations"}
                              </h4>

                              <div className="history-top3">

                                {item.result.top3.map(
                                  (crop, index) => (
                                    <div
                                      className="history-top3-item"
                                      key={index}
                                    >
                                      <span>
                                        #{index + 1}
                                      </span>

                                      <strong>
                                        {crop.crop}
                                      </strong>

                                      {crop.confidence !==
                                        undefined && (
                                        <small>
                                          {crop.confidence}%
                                        </small>
                                      )}
                                    </div>
                                  )
                                )}

                              </div>

                            </div>
                          )}

                        {/* BENEFITS */}

                        {item.result?.benefits &&
                          Array.isArray(item.result.benefits) && (
                            <div className="history-detail-section">

                              <h4>
                                {isHindi
                                  ? "लाभ"
                                  : "Benefits"}
                              </h4>

                              <ul className="history-list-details">
                                {item.result.benefits.map(
                                  (benefit, index) => (
                                    <li key={index}>
                                      {benefit}
                                    </li>
                                  )
                                )}
                              </ul>

                            </div>
                          )}

                        {/* APPLICATION TIPS */}

                        {item.result?.applicationTips &&
                          Array.isArray(
                            item.result.applicationTips
                          ) && (
                            <div className="history-detail-section">

                              <h4>
                                {isHindi
                                  ? "उपयोग के सुझाव"
                                  : "Application Tips"}
                              </h4>

                              <ul className="history-list-details">
                                {item.result.applicationTips.map(
                                  (tip, index) => (
                                    <li key={index}>
                                      {tip}
                                    </li>
                                  )
                                )}
                              </ul>

                            </div>
                          )}

                        {/* DESCRIPTION */}

                        {item.result?.description && (
                          <div className="history-detail-section">

                            <h4>
                              {isHindi
                                ? "विवरण"
                                : "Description"}
                            </h4>

                            <p className="history-description">
                              {item.result.description}
                            </p>

                          </div>
                        )}

                      </div>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </>
  );
}

export default History;