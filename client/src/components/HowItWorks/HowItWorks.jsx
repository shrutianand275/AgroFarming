import React from "react";
import "./HowItWorks.css";
import { useTranslation } from "react-i18next";

function HowItWorks() {

  const { t } = useTranslation();

  const steps = [
    {
      number: "1",
      title: t("howItWorks.step1.title"),
      description: t("howItWorks.step1.description"),
    },
    {
      number: "2",
      title: t("howItWorks.step2.title"),
      description: t("howItWorks.step2.description"),
    },
    {
      number: "3",
      title: t("howItWorks.step3.title"),
      description: t("howItWorks.step3.description"),
    },
  ];

  return (
    <section className="how-section">
      <div className="container">

        <div className="section-title text-center mb-5">
          <h2>{t("howItWorks.heading")}</h2>
          <p>{t("howItWorks.subheading")}</p>
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