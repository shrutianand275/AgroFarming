import React from "react";
import { useTranslation } from "react-i18next";

import {
  FaLeaf,
  FaChartLine,
  FaCalendarAlt,
  FaLightbulb,
  FaAward
} from "react-icons/fa";

import "./ResultCard.css";


/* ==========================================
   CROP HINDI NAMES
========================================== */

const cropHindiNames = {
  rice: "धान",
  wheat: "गेहूं",
  maize: "मक्का",
  corn: "मक्का",
  cotton: "कपास",
  sugarcane: "गन्ना",
  soybean: "सोयाबीन",
  groundnut: "मूंगफली",
  peanut: "मूंगफली",

  chickpea: "चना",
  gram: "चना",

  lentil: "मसूर",
  masoor: "मसूर",

  "pigeon peas": "अरहर",
  pigeonpea: "अरहर",
  "pigeon pea": "अरहर",

  "mung bean": "मूंग",
  mungbean: "मूंग",
  "green gram": "मूंग",

  blackgram: "उड़द",
  "black gram": "उड़द",

  "kidney beans": "राजमा",
  kidneybean: "राजमा",
  "kidney bean": "राजमा",

  peas: "मटर",

  mustard: "सरसों",
  barley: "जौ",

  millet: "बाजरा",
  "pearl millet": "बाजरा",

  sorghum: "ज्वार",
  jowar: "ज्वार",
  bajra: "बाजरा",

  potato: "आलू",
  tomato: "टमाटर",
  onion: "प्याज",
  carrot: "गाजर",

  banana: "केला",
  mango: "आम",
  apple: "सेब",
  papaya: "पपीता",
  pomegranate: "अनार",
  watermelon: "तरबूज",
  coconut: "नारियल",

  grapes: "अंगूर",
  grape: "अंगूर",

  coffee: "कॉफी",
  jute: "जूट",
  tobacco: "तंबाकू"
};


/* ==========================================
   SEASON HINDI NAMES
========================================== */

const seasonHindiNames = {
  kharif: "खरीफ",
  "kharif season": "खरीफ मौसम",

  rabi: "रबी",
  "rabi season": "रबी मौसम",

  zaid: "जायद",
  "zaid season": "जायद मौसम",

  summer: "गर्मी",
  "summer season": "गर्मी का मौसम",

  winter: "सर्दी",
  "winter season": "सर्दी का मौसम",

  monsoon: "मानसून",
  "monsoon season": "मानसून का मौसम",

  "post-monsoon": "मानसून के बाद",
  "post monsoon": "मानसून के बाद"
};


/* ==========================================
   FARMING TIP HINDI TRANSLATIONS
========================================== */

const tipHindiTranslations = {

  "avoid excessive nitrogen.":
    "अधिक नाइट्रोजन के उपयोग से बचें।",

  "ensure proper irrigation for the crop.":
    "फसल के लिए उचित सिंचाई सुनिश्चित करें।",

  "ensure adequate irrigation.":
    "पर्याप्त सिंचाई सुनिश्चित करें।",

  "maintain proper irrigation.":
    "उचित सिंचाई बनाए रखें।",

  "provide adequate water to the crop.":
    "फसल को पर्याप्त पानी दें।",

  "monitor the crop regularly.":
    "फसल की नियमित निगरानी करें।",

  "monitor crops regularly.":
    "फसलों की नियमित निगरानी करें।",

  "maintain proper soil moisture.":
    "मिट्टी में उचित नमी बनाए रखें।",

  "use fertilizers according to soil requirements.":
    "मिट्टी की आवश्यकताओं के अनुसार उर्वरक का उपयोग करें।",

  "use balanced fertilizers for better crop growth.":
    "बेहतर फसल वृद्धि के लिए संतुलित उर्वरकों का उपयोग करें।",

  "avoid excessive irrigation.":
    "अधिक सिंचाई से बचें।",

  "provide sufficient irrigation during dry periods.":
    "शुष्क अवधि के दौरान पर्याप्त सिंचाई करें।",

  "protect the crop from excessive rainfall.":
    "फसल को अत्यधिक वर्षा से बचाएं।",

  "ensure proper drainage in the field.":
    "खेत में उचित जल निकासी सुनिश्चित करें।",

  "use appropriate fertilizers.":
    "उचित उर्वरकों का उपयोग करें।",

  "apply fertilizers according to crop requirements.":
    "फसल की आवश्यकताओं के अनुसार उर्वरक डालें।",

  "avoid over-fertilization.":
    "अत्यधिक उर्वरक के उपयोग से बचें।",

  "maintain adequate soil moisture.":
    "मिट्टी में पर्याप्त नमी बनाए रखें।",

  "protect crops from excessive heat.":
    "फसलों को अत्यधिक गर्मी से बचाएं।",

  "protect crops from heavy rainfall.":
    "फसलों को भारी वर्षा से बचाएं।",

  "ensure good drainage.":
    "उचित जल निकासी सुनिश्चित करें।"
};


/* ==========================================
   NORMALIZE VALUE
========================================== */

const normalizeValue = (value) => {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase();

};


/* ==========================================
   TRANSLATE CROP
========================================== */

const translateCrop = (crop, language) => {

  if (!crop) {
    return "";
  }

  const isHindi = String(language)
    .toLowerCase()
    .startsWith("hi");

  if (!isHindi) {
    return crop;
  }

  const normalizedCrop = normalizeValue(crop);

  return cropHindiNames[normalizedCrop] || crop;
};


/* ==========================================
   TRANSLATE SEASON
========================================== */

const translateSeason = (season, language) => {

  if (!season) {
    return "";
  }

  const isHindi = String(language)
    .toLowerCase()
    .startsWith("hi");

  if (!isHindi) {
    return season;
  }

  const normalizedSeason = normalizeValue(season);

  return seasonHindiNames[normalizedSeason] || season;
};


/* ==========================================
   TRANSLATE FARMING TIP
========================================== */

const translateTip = (tip, language) => {

  if (!tip) {
    return "";
  }

  const isHindi = String(language)
    .toLowerCase()
    .startsWith("hi");

  if (!isHindi) {
    return tip;
  }

  const normalizedTip = normalizeValue(tip);

  return tipHindiTranslations[normalizedTip] || tip;
};


/* ==========================================
   RESULT CARD
========================================== */

const ResultCard = ({ result }) => {

  const { t, i18n } = useTranslation();

  if (!result) {
    return null;
  }

  const language = i18n.language;


  return (

    <div className="result-card">


      {/* HEADER */}

      <div className="result-header">

        <h3>
          🌾 {t("crop.result")}
        </h3>

      </div>


      <div className="result-content">


        {/* LEFT SECTION */}

        <div className="result-left">


          {/* RECOMMENDED CROP */}

          <div className="result-item">

            <div className="result-label">

              <FaLeaf />

              <span>
                {t("crop.recommendedCrop")}
              </span>

            </div>


            <div className="recommended-crop">

              {translateCrop(
                result.recommended_crop,
                language
              )}

            </div>

          </div>


          {/* CONFIDENCE */}

          <div className="result-item">

            <div className="result-label">

              <FaChartLine />

              <span>
                {t("crop.confidence")}
              </span>

            </div>


            <div className="confidence-value">

              {result.confidence}%

            </div>

          </div>


          {/* SEASON */}

          <div className="result-item">

            <div className="result-label">

              <FaCalendarAlt />

              <span>
                {t("crop.season")}
              </span>

            </div>


            <p>

              {translateSeason(
                result.season,
                language
              )}

            </p>

          </div>


          {/* FARMING TIP */}

          <div className="result-item">

            <div className="result-label">

              <FaLightbulb />

              <span>
                {t("crop.tips")}
              </span>

            </div>


            <p>

              {translateTip(
                result.tips,
                language
              )}

            </p>

          </div>


        </div>


        {/* RIGHT SECTION */}

        <div className="result-right">


          <div className="top-crops-title">

            <FaAward />

            <span>
              {t("crop.top3")}
            </span>

          </div>


          <table className="crop-result-table">

            <thead>

              <tr>

                <th>
                  #
                </th>

                <th>
                  {t("crop.crop")}
                </th>

                <th>
                  {t("crop.confidence")}
                </th>

              </tr>

            </thead>


            <tbody>

              {result.top3?.map((crop, index) => (

                <tr key={index}>


                  <td>
                    {index + 1}
                  </td>


                  <td className="crop-name">

                    {translateCrop(
                      crop.crop,
                      language
                    )}

                  </td>


                  <td>

                    {crop.confidence}%

                  </td>


                </tr>

              ))}

            </tbody>

          </table>


        </div>


      </div>


    </div>

  );

};


export default ResultCard;