import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Droplets,
  Thermometer,
  FlaskConical,
  Sprout
} from "lucide-react";

const soilTypes = [
  "Sandy",
  "Loamy",
  "Black",
  "Red",
  "Clayey"
];

const cropTypes = [
  "Cotton",
  "Groundnut",
  "Maize",
  "Rice",
  "Sugarcane",
  "Wheat"
];

export default function FertilizerForm({ onSubmit }) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    temperature: "",
    humidity: "",
    moisture: "",
    soilType: "",
    cropType: "",
    nitrogen: "",
    phosphorous: "",
    potassium: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="fertilizer-form" onSubmit={submit}>

      <div className="fertilizer-grid">

        {/* ================= TEMPERATURE ================= */}
        <div className="fertilizer-field">
          <label>
            <Thermometer />
            <span>{t("fertilizer.temperature")}</span>
          </label>

          <input
            type="number"
            step="0.01"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            placeholder={t("fertilizer.temperaturePlaceholder")}
            required
          />
        </div>

        {/* ================= HUMIDITY ================= */}
        <div className="fertilizer-field">
          <label>
            <Droplets />
            <span>{t("fertilizer.humidity")}</span>
          </label>

          <input
            type="number"
            step="0.01"
            name="humidity"
            value={formData.humidity}
            onChange={handleChange}
            placeholder={t("fertilizer.humidityPlaceholder")}
            required
          />
        </div>

        {/* ================= MOISTURE ================= */}
        <div className="fertilizer-field">
          <label>
            <Droplets />
            <span>{t("fertilizer.moisture")}</span>
          </label>

          <input
            type="number"
            step="0.01"
            name="moisture"
            value={formData.moisture}
            onChange={handleChange}
            placeholder={t("fertilizer.moisturePlaceholder")}
            required
          />
        </div>

        {/* ================= SOIL TYPE ================= */}
        <div className="fertilizer-field">
          <label>
            <Sprout />
            <span>{t("fertilizer.soilType")}</span>
          </label>

          <select
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
            required
          >
            <option value="">
              {t("fertilizer.selectSoilType")}
            </option>

            {soilTypes.map((soil) => (
              <option key={soil} value={soil}>
                {soil}
              </option>
            ))}
          </select>
        </div>

        {/* ================= CROP TYPE ================= */}
        <div className="fertilizer-field">
          <label>
            <Sprout />
            <span>{t("fertilizer.cropType")}</span>
          </label>

          <select
            name="cropType"
            value={formData.cropType}
            onChange={handleChange}
            required
          >
            <option value="">
              {t("fertilizer.selectCropType")}
            </option>

            {cropTypes.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        {/* ================= NITROGEN ================= */}
        <div className="fertilizer-field">
          <label>
            <FlaskConical />
            <span>{t("fertilizer.nitrogen")}</span>
          </label>

          <input
            type="number"
            name="nitrogen"
            value={formData.nitrogen}
            onChange={handleChange}
            placeholder={t("fertilizer.nitrogenPlaceholder")}
            required
          />
        </div>

        {/* ================= PHOSPHOROUS ================= */}
        <div className="fertilizer-field">
          <label>
            <FlaskConical />
            <span>{t("fertilizer.phosphorous")}</span>
          </label>

          <input
            type="number"
            name="phosphorous"
            value={formData.phosphorous}
            onChange={handleChange}
            placeholder={t("fertilizer.phosphorousPlaceholder")}
            required
          />
        </div>

        {/* ================= POTASSIUM ================= */}
        <div className="fertilizer-field">
          <label>
            <FlaskConical />
            <span>{t("fertilizer.potassium")}</span>
          </label>

          <input
            type="number"
            name="potassium"
            value={formData.potassium}
            onChange={handleChange}
            placeholder={t("fertilizer.potassiumPlaceholder")}
            required
          />
        </div>

      </div>

      {/* ================= BUTTON ================= */}
      <div className="fertilizer-action">
        <button
          type="submit"
          className="recommend-btn"
        >
          🌱 {t("fertilizer.recommend")}
        </button>
      </div>

    </form>
  );
}