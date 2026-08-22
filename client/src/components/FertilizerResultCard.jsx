import React from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle,
  Leaf,
  Info,
  Beaker
} from "lucide-react";

export default function FertilizerResultCard({ result }) {
  const { t } = useTranslation();

  if (!result) return null;

  return (
    <div className="fertilizer-result-card">

      {/* ================= HEADER ================= */}
      <div className="fertilizer-result-header">
        <CheckCircle className="fertilizer-result-header-icon" />

        <h4>
          {t("fertilizer.resultTitle")}
        </h4>
      </div>


      {/* ================= RESULT BODY ================= */}
      <div className="fertilizer-result-body">

        <div className="fertilizer-result-grid">

          {/* ================= RECOMMENDED FERTILIZER ================= */}
          <div className="fertilizer-result-item highlight">

            <div className="fertilizer-result-icon">
              <Beaker />
            </div>

            <div className="fertilizer-result-content">

              <h5>
                {t("fertilizer.recommendedFertilizer")}
              </h5>

              <p className="fertilizer-result-value">
                {result.fertilizer}
              </p>

            </div>

          </div>


          {/* ================= DESCRIPTION ================= */}
          {result.description && (
            <div className="fertilizer-result-item">

              <div className="fertilizer-result-icon">
                <Info />
              </div>

              <div className="fertilizer-result-content">

                <h5>
                  {t("fertilizer.description")}
                </h5>

                <p>
                  {result.description}
                </p>

              </div>

            </div>
          )}


          {/* ================= BENEFITS ================= */}
          {result.benefits &&
            result.benefits.length > 0 && (
              <div className="fertilizer-result-item">

                <div className="fertilizer-result-icon">
                  <Leaf />
                </div>

                <div className="fertilizer-result-content">

                  <h5>
                    {t("fertilizer.benefits")}
                  </h5>

                  <ul className="fertilizer-benefits-list">

                    {result.benefits.map(
                      (benefit, index) => (
                        <li key={index}>
                          {benefit}
                        </li>
                      )
                    )}

                  </ul>

                </div>

              </div>
            )}


          {/* ================= APPLICATION TIPS ================= */}
          {result.applicationTips &&
            result.applicationTips.length > 0 && (
              <div className="fertilizer-result-item">

                <div className="fertilizer-result-icon">
                  <Info />
                </div>

                <div className="fertilizer-result-content">

                  <h5>
                    {t("fertilizer.applicationTips")}
                  </h5>

                  <ul className="fertilizer-tips-list">

                    {result.applicationTips.map(
                      (tip, index) => (
                        <li key={index}>
                          {tip}
                        </li>
                      )
                    )}

                  </ul>

                </div>

              </div>
            )}

        </div>

      </div>

    </div>
  );
}