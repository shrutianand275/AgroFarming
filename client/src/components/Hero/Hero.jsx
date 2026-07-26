import React from "react";
import "./Hero.css";
import heroImage from "../../assets/images/farm-bg1.jpg";

const Hero = () => {
  return (
    <section className="hero-section">
      <img src={heroImage} alt="Farm" className="hero-bg" />

      <div className="hero-overlay"></div>

      <div className="container hero-content">

        <span className="hero-badge">
          SMART FARMING PLATFORM
        </span>

       

        <p>
          Empowering farmers using Artificial Intelligence with
          Crop Recommendation, Yield Prediction, Disease Detection,
          Weather Forecasting and Smart Farming solutions.
        </p>

      </div>
    </section>
  );
};

export default Hero;