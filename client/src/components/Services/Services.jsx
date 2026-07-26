import React from "react";
import "./Services.css";
import {
  FaSeedling,
  FaCloudSunRain,
  FaLeaf,
  FaRobot,
  FaBug,
  FaChartLine,
} from "react-icons/fa";

const services = [
  {
    icon: <FaSeedling />,
    title: "Crop Recommendation",
    description:
      "AI-based crop suggestions using soil and weather conditions.",
  },
  {
    icon: <FaChartLine />,
    title: "Yield Prediction",
    description:
      "Predict crop production using machine learning models.",
  },
  {
    icon: <FaBug />,
    title: "Disease Detection",
    description:
      "Detect crop diseases from uploaded crop images.",
  },
  {
    icon: <FaLeaf />,
    title: "Fertilizer Guide",
    description:
      "Get smart fertilizer recommendations instantly.",
  },
  {
    icon: <FaCloudSunRain />,
    title: "Weather Forecast",
    description:
      "Real-time weather updates for better farming decisions.",
  },
  {
    icon: <FaRobot />,
    title: "AI Chatbot",
    description:
      "Get instant answers to your farming questions.",
  },
];

function Services() {
  return (
    <section className="services-section">
      <div className="container">

        <div className="section-title text-center">
          <h2>Our AI Services</h2>
          <p>Smart AI-powered solutions for modern farming.</p>
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