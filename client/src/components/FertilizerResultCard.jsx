import React from "react";
import { useTranslation } from "react-i18next";

import {
  CheckCircle,
  Leaf,
  Info,
  Beaker
} from "lucide-react";


/* =====================================================
   FERTILIZER NAME TRANSLATION
===================================================== */

const fertilizerHindi = {

  "Urea":
    "यूरिया",

  "DAP":
    "डीएपी",

  "MOP":
    "एमओपी",

  "TSP":
    "टीएसपी",

  "Potassium":
    "पोटैशियम",

  "Potassium Chloride":
    "पोटैशियम क्लोराइड",

  "Potassium Sulphate":
    "पोटैशियम सल्फेट",

  "Ammonium Sulphate":
    "अमोनियम सल्फेट",

  "Single Super Phosphate":
    "सिंगल सुपर फॉस्फेट",

  "Super Phosphate":
    "सुपर फॉस्फेट",

  "NPK":
    "एनपीके",

  "NPK 10-26-26":
    "एनपीके 10-26-26",

  "NPK 14-35-14":
    "एनपीके 14-35-14",

  "NPK 17-17-17":
    "एनपीके 17-17-17",

  "NPK 20-20-20":
    "एनपीके 20-20-20",

  "20-20":
    "20-20",

  "28-28":
    "28-28",

  "20-20-20":
    "20-20-20",

  "14-35-14":
    "14-35-14",

  "28-28-0":
    "28-28-0",

  "17-17-17":
    "17-17-17",

  "10-26-26":
    "10-26-26"

};


/* =====================================================
   TRANSLATION HELPER FOR FERTILIZER NAME ONLY
===================================================== */

const translateFertilizer = (value, isHindi) => {

  if (!value) {
    return "";
  }

  if (!isHindi) {
    return value;
  }

  const text = String(value).trim();

  return fertilizerHindi[text] || text;

};


export default function FertilizerResultCard({ result }) {

  const { t, i18n } = useTranslation();


  if (!result) {
    return null;
  }


  const isHindi =
    String(i18n.language || "en")
      .toLowerCase()
      .startsWith("hi");


  return (

    <div className="fertilizer-result-card">


      {/* ================= HEADER ================= */}

      <div className="fertilizer-result-header">

        <CheckCircle
          className="fertilizer-result-header-icon"
        />

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

                {t(
                  "fertilizer.recommendedFertilizer"
                )}

              </h5>


              <p className="fertilizer-result-value">

                {translateFertilizer(
                  result.fertilizer,
                  isHindi
                )}

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

                  {t(
                    "fertilizer.description"
                  )}

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

                    {t(
                      "fertilizer.benefits"
                    )}

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

                    {t(
                      "fertilizer.applicationTips"
                    )}

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