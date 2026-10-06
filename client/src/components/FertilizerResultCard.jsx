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

  "20-20-20":
    "20-20-20",

  "14-35-14":
    "14-35-14",

  "28-28-0":
    "28-28-0",

  "17-17-17":
    "17-17-17"

};


/* =====================================================
   SOIL / CROP RELATED TEXT
===================================================== */

const textHindi = {

  "Improves nitrogen availability":
    "नाइट्रोजन की उपलब्धता में सुधार करता है।",

  "Improves phosphorus availability":
    "फॉस्फोरस की उपलब्धता में सुधार करता है।",

  "Improves potassium availability":
    "पोटैशियम की उपलब्धता में सुधार करता है।",

  "Provides essential nutrients":
    "आवश्यक पोषक तत्व प्रदान करता है।",

  "Promotes healthy crop growth":
    "फसल की स्वस्थ वृद्धि को बढ़ावा देता है।",

  "Improves plant growth":
    "पौधे की वृद्धि में सुधार करता है।",

  "Improves root development":
    "जड़ों के विकास में सुधार करता है।",

  "Supports flowering and fruiting":
    "फूल और फल बनने में सहायता करता है।",

  "Improves yield":
    "उपज में सुधार करता है।",

  "Apply as recommended":
    "अनुशंसित मात्रा के अनुसार प्रयोग करें।",

  "Apply near the root zone":
    "जड़ क्षेत्र के पास प्रयोग करें।",

  "Apply fertilizer evenly":
    "उर्वरक को समान रूप से डालें।",

  "Avoid excessive application":
    "अधिक मात्रा में प्रयोग करने से बचें।",

  "Water the crop after application":
    "प्रयोग के बाद फसल में पानी दें।",

  "Apply during active crop growth":
    "फसल की सक्रिय वृद्धि के दौरान प्रयोग करें।"

};


/* =====================================================
   TRANSLATION HELPER
===================================================== */

const translateText = (value, isHindi) => {

  if (!value) {
    return "";
  }

  if (!isHindi) {
    return value;
  }

  const text = String(value).trim();

  return textHindi[text] || text;

};


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

                  {translateText(
                    result.description,
                    isHindi
                  )}

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

                          {translateText(
                            benefit,
                            isHindi
                          )}

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

                          {translateText(
                            tip,
                            isHindi
                          )}

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