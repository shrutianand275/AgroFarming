import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar/Navbar";
import FertilizerForm from "../../components/FertilizerForm";
import FertilizerResultCard from "../../components/FertilizerResultCard";

import { recommendFertilizer } from "../../services/api";

import "./FertilizerRecommendation.css";

const FertilizerRecommendation = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleRecommendation = async (formData) => {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const currentLanguage =
        localStorage.getItem("i18nextLng") || "en";

      const language = currentLanguage.startsWith("hi")
        ? "hi"
        : "en";

      const response = await recommendFertilizer({
        Temperature: Number(formData.temperature),
        Humidity: Number(formData.humidity),
        Moisture: Number(formData.moisture),
        Soil_Type: formData.soilType,
        Crop_Type: formData.cropType,
        Nitrogen: Number(formData.nitrogen),
        Phosphorous: Number(formData.phosphorous),
        Potassium: Number(formData.potassium),
        language: language
      });

      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
      setError(t("fertilizer.serverError"));
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <main className="fertilizer-page">
        <div className="fertilizer-container">

          {/* TITLE */}
          <div className="fertilizer-header">
            <h1 className="fertilizer-title">
              {t("fertilizer.title")}
            </h1>

          </div>

          {/* INFORMATION */}
          <div className="fertilizer-alert">
            <strong>
              {t("fertilizer.noteTitle")}
            </strong>
            <br />
            <span>
              {t("fertilizer.note")}
            </span>
          </div>

          {/* FORM CARD */}
          <div className="fertilizer-card">
            <div className="fertilizer-card-body">
              <FertilizerForm
                onSubmit={handleRecommendation}
              />
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="fertilizer-loading">
              <div
                className="spinner-border text-success"
                role="status"
              />

              <span>
                {t("fertilizer.predicting")}
              </span>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="fertilizer-error">
              {error}
            </div>
          )}

          {/* RESULT */}
          {result && (
            <FertilizerResultCard result={result} />
          )}

        </div>
      </main>

    </>
  );
};

export default FertilizerRecommendation;