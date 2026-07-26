import React from "react";
import "./HowItWorks.css";

const steps = [
  {
    number: "1",
    title: "Enter Farm Details",
    description:
      "Fill the details about your farm, including soil type, rainfall, temperature, humidity, and upload crop images for AI analysis.",
  },
  {
    number: "2",
    title: "AI Analysis",
    description:
      "Our machine learning models process your data and generate accurate farming recommendations.",
  },
  {
    number: "3",
    title: "Get Smart Results",
    description:
      "Receive crop recommendations, disease detection, fertilizer suggestions, weather forecasts, etc.",
  },
];

function HowItWorks() {
  return (
    <section className="how-section">
      <div className="container">

        <div className="section-title text-center mb-5">
          <h2>How AgroFarming Works</h2>
          <p>Three simple steps to make smarter farming decisions using AI.</p>
        </div>

        <div className="row g-4">

          {steps.map((step, index) => (
            <div className="col-lg-4 col-md-4 col-sm-4 col-12" key={index}>

              <div className="step-card">

                <div className="step-number">
                  {step.number}
                </div>

                <h4>{step.title}</h4>

                <p>{step.description}</p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;