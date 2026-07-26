import React from "react";
import "./Hero.css";
import heroImage from "../../assets/images/farm-bg1.jpg";
import { useTranslation } from "react-i18next";

const Hero = () => {

  const { t } = useTranslation();

  return (
    <section className="hero-section">
      <img src={heroImage} alt="Farm" className="hero-bg" />

      <div className="hero-overlay"></div>

      <div className="container hero-content">

        <span className="hero-badge">
          {t("hero.badge")}
        </span>

        <p className="hero-description">
          {t("hero.description")}
        </p>

      </div>
    </section>
  );
};

export default Hero;