import React from "react";
import "./Services.css";
import { useTranslation } from "react-i18next";
import {
  FaSeedling,
  FaCloudSunRain,
  FaLeaf,
  FaRobot,
  FaBug,
  FaChartLine,
} from "react-icons/fa";

function Services() {

  const { t } = useTranslation();

  const services = [
    {
      icon: <FaSeedling />,
      title: t("services.cropRecommendation.title"),
      description: t("services.cropRecommendation.description"),
    },
    {
      icon: <FaChartLine />,
      title: t("services.yieldPrediction.title"),
      description: t("services.yieldPrediction.description"),
    },
    {
      icon: <FaBug />,
      title: t("services.diseaseDetection.title"),
      description: t("services.diseaseDetection.description"),
    },
    {
      icon: <FaLeaf />,
      title: t("services.fertilizerGuide.title"),
      description: t("services.fertilizerGuide.description"),
    },
    {
      icon: <FaCloudSunRain />,
      title: t("services.weatherForecast.title"),
      description: t("services.weatherForecast.description"),
    },
    {
      icon: <FaRobot />,
      title: t("services.aiChatbot.title"),
      description: t("services.aiChatbot.description"),
    },
  ];

  return (
    <section className="services-section">
      <div className="container">

        <div className="section-title text-center">
          <h2>{t("services.heading")}</h2>
          <p>{t("services.subheading")}</p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-icon">{service.icon}</div>
              <h4>{service.title}</h4>
              <p>{service.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Services;