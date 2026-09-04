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
  History as HistoryIcon
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

  const getResultText = (item) => {
    const result = item.result;

    if (!result) return "";

    if (typeof result === "string") {
      return result;
    }

    if (result.recommended_crop) {
      return `${isHindi ? "सुझाई गई फसल" : "Recommended Crop"}: ${
        result.recommended_crop
      }`;
    }

    if (result.crop) {
      return `${isHindi ? "फसल" : "Crop"}: ${result.crop}`;
    }

    if (result.fertilizer) {
      return `${isHindi ? "उर्वरक" : "Fertilizer"}: ${
        result.fertilizer
      }`;
    }

    if (result.disease) {
      return `${isHindi ? "रोग" : "Disease"}: ${result.disease}`;
    }

    if (result.predicted_yield !== undefined) {
      return `${isHindi ? "अनुमानित उपज" : "Predicted Yield"}: ${
        result.predicted_yield
      }`;
    }

    if (result.yield !== undefined) {
      return `${isHindi ? "उपज" : "Yield"}: ${result.yield}`;
    }

    return "";
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

            {history.map((item) => (

              <div
                className="history-card"
                key={item.id}
              >

                <div className={`history-card-icon ${item.type}`}>
                  {getIcon(item.type)}
                </div>


                <div className="history-card-content">

                  <div className="history-card-top">

                    <div>
                      <span className="history-type">
                        {getTypeName(item.type)}
                      </span>

                      <h3>
                        {isHindi
                          ? getTypeName(item.type)
                          : item.title}
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


                  {/* RESULT */}

                  {getResultText(item) && (
                    <div className="history-result">
                      <strong>
                        {isHindi
                          ? "परिणाम"
                          : "Result"}
                      </strong>

                      <span>
                        {getResultText(item)}
                      </span>
                    </div>
                  )}


                  {/* DATE */}

                  <div className="history-date">
                    <Clock size={14} />

                    {formatDate(item.created_at)}
                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </>
  );
}

export default History;