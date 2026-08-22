import React, { useEffect, useState } from "react";
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

const ClimateForm = ({ onSubmit }) => {

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

  return (
    <form className="climate-form" onSubmit={submit}>

      <div className="climate-grid">

        {/* STATE */}
        <div className="climate-field">

          <label>
            <MapPin />
            <span>State</span>
          </label>

          <select
            name="state"
            value={formData.state}
            onChange={handleStateChange}
          >
            <option value="">Select State</option>

            {states.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}

          </select>

        </div>


        {/* CITY */}
        <div className="climate-field">

          <label>
            <Building2 />
            <span>City</span>
          </label>

          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={!formData.state}
          >
            <option value="">Select City</option>

            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}

          </select>

        </div>


        {/* MONTH */}
        <div className="climate-field">

          <label>
            <CalendarDays />
            <span>Month</span>
          </label>

          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
          >
            <option value="">Select Month</option>

            {months.map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}

          </select>

        </div>


        {/* SOIL */}
        <div className="climate-field">

          <label>
            <Sprout />
            <span>Soil Type</span>
          </label>

          <select
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
          >
            <option value="">Select Soil Type</option>

            {soilTypes.map(soil => (
              <option key={soil} value={soil}>
                {soil}
              </option>
            ))}

          </select>

        </div>


        {/* TEMPERATURE */}
        <div className="climate-field">

          <label>
            <Thermometer />
            <span>Temperature (°C)</span>
          </label>

          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            placeholder="Auto Filled"
          />

        </div>


        {/* HUMIDITY */}
        <div className="climate-field">

          <label>
            <Droplets />
            <span>Humidity (%)</span>
          </label>

          <input
            type="number"
            name="humidity"
            value={formData.humidity}
            onChange={handleChange}
            placeholder="Auto Filled"
          />

        </div>


        {/* RAINFALL */}
        <div className="climate-field">

          <label>
            <CloudRain />
            <span>Rainfall (mm)</span>
          </label>

          <input
            type="number"
            name="rainfall"
            value={formData.rainfall}
            onChange={handleChange}
            placeholder="Auto Filled"
          />

        </div>


        {/* NITROGEN */}
        <div className="climate-field">

          <label>
            <FlaskConical />
            <span>Nitrogen (N)</span>
          </label>

          <input
            type="number"
            name="N"
            value={formData.N}
            onChange={handleChange}
            placeholder="e.g. 90"
          />

        </div>


        {/* PHOSPHORUS */}
        <div className="climate-field">

          <label>
            <TestTube />
            <span>Phosphorus (P)</span>
          </label>

          <input
            type="number"
            name="P"
            value={formData.P}
            onChange={handleChange}
            placeholder="e.g. 42"
          />

        </div>


        {/* POTASSIUM */}
        <div className="climate-field">

          <label>
            <TestTube />
            <span>Potassium (K)</span>
          </label>

          <input
            type="number"
            name="K"
            value={formData.K}
            onChange={handleChange}
            placeholder="e.g. 43"
          />

        </div>


        {/* PH */}
        <div className="climate-field">

          <label>
            <Gauge />
            <span>Soil pH</span>
          </label>

          <input
            type="number"
            step="0.1"
            name="ph"
            value={formData.ph}
            onChange={handleChange}
            placeholder="6.5"
          />

        </div>


        {/* BUTTON - FULL WIDTH NEW ROW */}
        <div className="recommend-action">
          <button
            type="submit"
            className="recommend-btn"
            disabled={loadingClimate}
          >
            🌱 Recommend Crop
          </button>
        </div>

      </div>

    </form>
  );
};

export default ClimateForm;