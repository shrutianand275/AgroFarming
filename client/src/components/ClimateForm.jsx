import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  MapPin,
  Building2,
  CalendarDays,
  Sprout,
  Thermometer,
  Droplets,
  CloudRain,
  FlaskConical,
  TestTube,
  Gauge
} from "lucide-react";

import {
  getStates,
  getCities,
  getClimateData
} from "../services/api";

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const soilTypes = [
  "Clay",
  "Loamy",
  "Sandy",
  "Black",
  "Red",
  "Alluvial"
];

/* ==========================================
   STATE HINDI NAMES
========================================== */

const stateHindiNames = {
  "Andhra Pradesh": "आंध्र प्रदेश",
  "Arunachal Pradesh": "अरुणाचल प्रदेश",
  "Assam": "असम",
  "Bihar": "बिहार",
  "Chhattisgarh": "छत्तीसगढ़",
  "Goa": "गोवा",
  "Gujarat": "गुजरात",
  "Haryana": "हरियाणा",
  "Himachal Pradesh": "हिमाचल प्रदेश",
  "Jharkhand": "झारखंड",
  "Karnataka": "कर्नाटक",
  "Kerala": "केरल",
  "Madhya Pradesh": "मध्य प्रदेश",
  "Maharashtra": "महाराष्ट्र",
  "Manipur": "मणिपुर",
  "Meghalaya": "मेघालय",
  "Mizoram": "मिज़ोरम",
  "Nagaland": "नागालैंड",
  "Odisha": "ओडिशा",
  "Punjab": "पंजाब",
  "Rajasthan": "राजस्थान",
  "Sikkim": "सिक्किम",
  "Tamil Nadu": "तमिलनाडु",
  "Telangana": "तेलंगाना",
  "Tripura": "त्रिपुरा",
  "Uttar Pradesh": "उत्तर प्रदेश",
  "Uttarakhand": "उत्तराखंड",
  "West Bengal": "पश्चिम बंगाल",
  "Delhi": "दिल्ली",
  "Jammu and Kashmir": "जम्मू और कश्मीर",
  "Ladakh": "लद्दाख",
  "Puducherry": "पुडुचेरी",
  "Chandigarh": "चंडीगढ़"
};


/* ==========================================
   CITY HINDI NAMES
========================================== */

const cityHindiNames = {

  /* Maharashtra */
  "Mumbai": "मुंबई",
  "Pune": "पुणे",
  "Nagpur": "नागपुर",
  "Nashik": "नासिक",
  "Aurangabad": "औरंगाबाद",
  "Solapur": "सोलापुर",
  "Kolhapur": "कोल्हापुर",
  "Amravati": "अमरावती",
  "Nanded": "नांदेड",
  "Sangli": "सांगली",
  "Satara": "सातारा",
  "Jalgaon": "जलगांव",
  "Akola": "अकोला",
  "Latur": "लातूर",
  "Ahmednagar": "अहमदनगर",
  "Dhule": "धुले",
  "Chandrapur": "चंद्रपुर",
  "Thane": "ठाणे",
  "Raigad": "रायगढ़",

  /* Delhi */
  "Delhi": "दिल्ली",
  "New Delhi": "नई दिल्ली",

  /* Gujarat */
  "Ahmedabad": "अहमदाबाद",
  "Surat": "सूरत",
  "Vadodara": "वडोदरा",
  "Rajkot": "राजकोट",
  "Bhavnagar": "भावनगर",
  "Jamnagar": "जामनगर",
  "Gandhinagar": "गांधीनगर",
  "Junagadh": "जूनागढ़",
  "Anand": "आनंद",
  "Bharuch": "भरूच",
  "Vapi": "वापी",

  /* Karnataka */
  "Bengaluru": "बेंगलुरु",
  "Bangalore": "बेंगलुरु",
  "Mysore": "मैसूर",
  "Mysuru": "मैसूर",
  "Mangalore": "मैंगलोर",
  "Mangaluru": "मैंगलुरु",
  "Hubli": "हुबली",
  "Hubballi": "हुबली",
  "Belgaum": "बेलगावी",
  "Belagavi": "बेलगावी",
  "Dharwad": "धारवाड़",
  "Gulbarga": "गुलबर्गा",
  "Kalaburagi": "कलबुर्गी",
  "Davangere": "दावणगेरे",
  "Shivamogga": "शिवमोग्गा",

  /* Madhya Pradesh */
  "Bhopal": "भोपाल",
  "Indore": "इंदौर",
  "Gwalior": "ग्वालियर",
  "Jabalpur": "जबलपुर",
  "Ujjain": "उज्जैन",
  "Sagar": "सागर",
  "Rewa": "रीवा",
  "Satna": "सतना",
  "Dewas": "देवास",
  "Ratlam": "रतलाम",

  /* Rajasthan */
  "Jaipur": "जयपुर",
  "Jodhpur": "जोधपुर",
  "Udaipur": "उदयपुर",
  "Kota": "कोटा",
  "Ajmer": "अजमेर",
  "Bikaner": "बीकानेर",
  "Alwar": "अलवर",
  "Bharatpur": "भरतपुर",
  "Sikar": "सीकर",
  "Pali": "पाली",

  /* Tamil Nadu */
  "Chennai": "चेन्नई",
  "Coimbatore": "कोयंबटूर",
  "Madurai": "मदुरै",
  "Salem": "सेलम",
  "Tiruchirappalli": "तिरुचिरापल्ली",
  "Trichy": "तिरुचिरापल्ली",
  "Tiruppur": "तिरुप्पुर",
  "Erode": "इरोड",
  "Vellore": "वेल्लोर",
  "Thanjavur": "तंजावुर",

  /* Telangana */
  "Hyderabad": "हैदराबाद",
  "Warangal": "वारंगल",
  "Nizamabad": "निजामाबाद",
  "Karimnagar": "करीमनगर",
  "Khammam": "खम्मम",

  /* Uttar Pradesh */
  "Lucknow": "लखनऊ",
  "Kanpur": "कानपुर",
  "Agra": "आगरा",
  "Varanasi": "वाराणसी",
  "Prayagraj": "प्रयागराज",
  "Allahabad": "प्रयागराज",
  "Meerut": "मेरठ",
  "Ghaziabad": "गाजियाबाद",
  "Noida": "नोएडा",
  "Bareilly": "बरेली",
  "Moradabad": "मुरादाबाद",
  "Aligarh": "अलीगढ़",
  "Gorakhpur": "गोरखपुर",
  "Jhansi": "झांसी",
  "Mathura": "मथुरा",
  "Ayodhya": "अयोध्या",

  /* Bihar */
  "Patna": "पटना",
  "Gaya": "गया",
  "Muzaffarpur": "मुजफ्फरपुर",
  "Bhagalpur": "भागलपुर",
  "Darbhanga": "दरभंगा",
  "Purnia": "पूर्णिया",
  "Ara": "आरा",
  "Arrah": "आरा",
  "Begusarai": "बेगूसराय",
  "Katihar": "कटिहार",
  "Munger": "मुंगेर",
  "Chapra": "छपरा",
  "Sasaram": "सासाराम",
  "Hajipur": "हाजीपुर",
  "Nawada": "नवादा",

  /* West Bengal */
  "Kolkata": "कोलकाता",
  "Howrah": "हावड़ा",
  "Durgapur": "दुर्गापुर",
  "Siliguri": "सिलीगुड़ी",
  "Asansol": "आसनसोल",

  /* Punjab */
  "Amritsar": "अमृतसर",
  "Ludhiana": "लुधियाना",
  "Jalandhar": "जालंधर",
  "Patiala": "पटियाला",
  "Bathinda": "बठिंडा",

  /* Haryana */
  "Gurgaon": "गुरुग्राम",
  "Gurugram": "गुरुग्राम",
  "Faridabad": "फरीदाबाद",
  "Panipat": "पानीपत",
  "Ambala": "अंबाला",
  "Hisar": "हिसार",
  "Rohtak": "रोहतक",

  /* Jharkhand */
  "Ranchi": "रांची",
  "Jamshedpur": "जमशेदपुर",
  "Dhanbad": "धनबाद",
  "Bokaro": "बोकारो",
  "Deoghar": "देवघर",

  /* Chhattisgarh */
  "Raipur": "रायपुर",
  "Bhilai": "भिलाई",
  "Bilaspur": "बिलासपुर",
  "Durg": "दुर्ग",
  "Korba": "कोरबा",

  /* Odisha */
  "Bhubaneswar": "भुवनेश्वर",
  "Cuttack": "कटक",
  "Rourkela": "राउरकेला",
  "Puri": "पुरी",
  "Sambalpur": "संबलपुर",

  /* Kerala */
  "Thiruvananthapuram": "तिरुवनंतपुरम",
  "Kochi": "कोच्चि",
  "Kozhikode": "कोझिकोड",
  "Kollam": "कोल्लम",
  "Thrissur": "त्रिशूर",

  /* Andhra Pradesh */
  "Visakhapatnam": "विशाखापत्तनम",
  "Vijayawada": "विजयवाड़ा",
  "Guntur": "गुंटूर",
  "Tirupati": "तिरुपति",
  "Nellore": "नेल्लोर",
  "Kurnool": "कुरनूल",

  /* Assam */
  "Guwahati": "गुवाहाटी",
  "Dibrugarh": "डिब्रूगढ़",
  "Silchar": "सिलचर",
  "Jorhat": "जोरहाट",

  /* Himachal Pradesh */
  "Shimla": "शिमला",
  "Manali": "मनाली",
  "Dharamshala": "धर्मशाला",
  "Mandi": "मंडी",
  "Solan": "सोलन",

  /* Uttarakhand */
  "Dehradun": "देहरादून",
  "Haridwar": "हरिद्वार",
  "Nainital": "नैनीताल",
  "Rishikesh": "ऋषिकेश",
  "Haldwani": "हल्द्वानी",

  /* Goa */
  "Panaji": "पणजी",
  "Margao": "मडगांव",
  "Vasco da Gama": "वास्को द गामा"
};


/* ==========================================
   MONTH HINDI NAMES
========================================== */

const monthHindiNames = {
  "January": "जनवरी",
  "February": "फरवरी",
  "March": "मार्च",
  "April": "अप्रैल",
  "May": "मई",
  "June": "जून",
  "July": "जुलाई",
  "August": "अगस्त",
  "September": "सितंबर",
  "October": "अक्टूबर",
  "November": "नवंबर",
  "December": "दिसंबर"
};


/* ==========================================
   SOIL HINDI NAMES
========================================== */

const soilHindiNames = {
  "Clay": "चिकनी मिट्टी",
  "Loamy": "दोमट मिट्टी",
  "Sandy": "रेतीली मिट्टी",
  "Black": "काली मिट्टी",
  "Red": "लाल मिट्टी",
  "Alluvial": "जलोढ़ मिट्टी"
};


const ClimateForm = ({ onSubmit }) => {

  const { t, i18n } = useTranslation();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingClimate, setLoadingClimate] = useState(false);

  const [formData, setFormData] = useState({
    state: "",
    city: "",
    month: "",
    soilType: "",
    temperature: "",
    humidity: "",
    rainfall: "",
    N: "",
    P: "",
    K: "",
    ph: ""
  });


  useEffect(() => {
    loadStates();
  }, []);


  const loadStates = async () => {
    try {
      const res = await getStates();
      setStates(res.states || []);
    } catch (error) {
      console.log(error);
    }
  };


  const handleStateChange = async (e) => {

    const state = e.target.value;

    setFormData(prev => ({
      ...prev,
      state,
      city: ""
    }));

    setCities([]);

    if (!state) return;

    try {
      const res = await getCities(state);
      setCities(res.cities || []);
    } catch (error) {
      console.log(error);
    }
  };


  const handleChange = (e) => {

    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  };


  useEffect(() => {

    if (
      !formData.state ||
      !formData.city ||
      !formData.month
    ) {
      return;
    }

    fetchClimate();

  }, [
    formData.state,
    formData.city,
    formData.month
  ]);


  const fetchClimate = async () => {

    try {

      setLoadingClimate(true);

      const response = await getClimateData({
        state: formData.state,
        city: formData.city,
        month: formData.month
      });

      setFormData(prev => ({
        ...prev,
        temperature: response.data?.temperature ?? "",
        humidity: response.data?.humidity ?? "",
        rainfall: response.data?.rainfall ?? ""
      }));

    } catch (error) {
      console.log(error);
    } finally {
      setLoadingClimate(false);
    }

  };


  const submit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };


  /* ==========================================
     TRANSLATION HELPERS
  ========================================== */

  const getStateName = (state) => {

    if (i18n.language === "hi") {
      return stateHindiNames[state] || state;
    }

    return state;
  };


  const getCityName = (city) => {

    if (i18n.language === "hi") {
      return cityHindiNames[city] || city;
    }

    return city;
  };


  const getMonthName = (month) => {

    if (i18n.language === "hi") {
      return monthHindiNames[month] || month;
    }

    return month;
  };


  const getSoilName = (soil) => {

    if (i18n.language === "hi") {
      return soilHindiNames[soil] || soil;
    }

    return soil;
  };


  return (

    <form
      className="climate-form"
      onSubmit={submit}
    >

      <div className="climate-grid">

        {/* STATE */}
        <div className="climate-field">

          <label>
            <MapPin />
            <span>{t("crop.state")}</span>
          </label>

          <select
            name="state"
            value={formData.state}
            onChange={handleStateChange}
          >

            <option value="">
              {t("crop.selectState")}
            </option>

            {states.map(state => (

              <option
                key={state}
                value={state}
              >
                {getStateName(state)}
              </option>

            ))}

          </select>

        </div>


        {/* CITY */}
        <div className="climate-field">

          <label>
            <Building2 />
            <span>{t("crop.city")}</span>
          </label>

          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={!formData.state}
          >

            <option value="">
              {t("crop.selectCity")}
            </option>

            {cities.map(city => (

              <option
                key={city}
                value={city}
              >
                {getCityName(city)}
              </option>

            ))}

          </select>

        </div>


        {/* MONTH */}
        <div className="climate-field">

          <label>
            <CalendarDays />
            <span>{t("crop.month")}</span>
          </label>

          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
          >

            <option value="">
              {t("crop.selectMonth")}
            </option>

            {months.map(month => (

              <option
                key={month}
                value={month}
              >
                {getMonthName(month)}
              </option>

            ))}

          </select>

        </div>


        {/* SOIL */}
        <div className="climate-field">

          <label>
            <Sprout />
            <span>{t("crop.soilType")}</span>
          </label>

          <select
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
          >

            <option value="">
              {t("crop.selectSoilType")}
            </option>

            {soilTypes.map(soil => (

              <option
                key={soil}
                value={soil}
              >
                {getSoilName(soil)}
              </option>

            ))}

          </select>

        </div>


        {/* TEMPERATURE */}
        <div className="climate-field">

          <label>
            <Thermometer />
            <span>{t("crop.temperature")} (°C)</span>
          </label>

          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            placeholder={t("crop.autoFilled")}
          />

        </div>


        {/* HUMIDITY */}
        <div className="climate-field">

          <label>
            <Droplets />
            <span>{t("crop.humidity")} (%)</span>
          </label>

          <input
            type="number"
            name="humidity"
            value={formData.humidity}
            onChange={handleChange}
            placeholder={t("crop.autoFilled")}
          />

        </div>


        {/* RAINFALL */}
        <div className="climate-field">

          <label>
            <CloudRain />
            <span>{t("crop.rainfall")} (mm)</span>
          </label>

          <input
            type="number"
            name="rainfall"
            value={formData.rainfall}
            onChange={handleChange}
            placeholder={t("crop.autoFilled")}
          />

        </div>


        {/* NITROGEN */}
        <div className="climate-field">

          <label>
            <FlaskConical />
            <span>{t("crop.nitrogen")}</span>
          </label>

          <input
            type="number"
            name="N"
            value={formData.N}
            onChange={handleChange}
            placeholder={t("crop.nitrogenPlaceholder")}
          />

        </div>


        {/* PHOSPHORUS */}
        <div className="climate-field">

          <label>
            <TestTube />
            <span>{t("crop.phosphorus")}</span>
          </label>

          <input
            type="number"
            name="P"
            value={formData.P}
            onChange={handleChange}
            placeholder={t("crop.phosphorusPlaceholder")}
          />

        </div>


        {/* POTASSIUM */}
        <div className="climate-field">

          <label>
            <TestTube />
            <span>{t("crop.potassium")}</span>
          </label>

          <input
            type="number"
            name="K"
            value={formData.K}
            onChange={handleChange}
            placeholder={t("crop.potassiumPlaceholder")}
          />

        </div>


        {/* PH */}
        <div className="climate-field">

          <label>
            <Gauge />
            <span>{t("crop.ph")}</span>
          </label>

          <input
            type="number"
            step="0.1"
            name="ph"
            value={formData.ph}
            onChange={handleChange}
            placeholder={t("crop.phPlaceholder")}
          />

        </div>


        {/* BUTTON */}
        <div className="recommend-action">

          <button
            type="submit"
            className="recommend-btn"
            disabled={loadingClimate}
          >
            🌱 {t("crop.recommend")}
          </button>

        </div>

      </div>

    </form>

  );

};

export default ClimateForm;