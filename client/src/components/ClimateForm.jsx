 import React, { useEffect, useState } from "react";
import {
  getStates,
  getCities,
  getClimateData
} from "../services/api";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
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

  const [formData, setFormData] = useState({
    state: "",
    city: "",
    month: "",
    temperature: "",
    humidity: "",
    rainfall: "",
    N: "",
    P: "",
    K: "",
    ph: "",
    soilType: ""
  });

  // -----------------------------
  // Load States
  // -----------------------------

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      const response = await getStates();
      setStates(response.states);
    } catch (error) {
      console.log(error);
    }
  };

  // -----------------------------
  // Load Cities
  // -----------------------------

  const handleStateChange = async (e) => {

    const state = e.target.value;

    setFormData({
      ...formData,
      state,
      city: ""
    });

    try {

      const response = await getCities(state);

      setCities(response.cities);

    } catch (error) {

      console.log(error);

    }
  };

  // -----------------------------
  // Handle Inputs
  // -----------------------------

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

  // -----------------------------
  // Get Climate Data
  // -----------------------------

  const fetchClimate = async () => {

    if (
      !formData.state ||
      !formData.city ||
      !formData.month
    ) return;

    try {

      const response = await getClimateData({

        state: formData.state,

        city: formData.city,

        month: formData.month

      });

      setFormData((prev) => ({

        ...prev,

        temperature: response.data.temperature,

        humidity: response.data.humidity,

        rainfall: response.data.rainfall

      }));

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchClimate();

  }, [formData.city, formData.month]);

  // -----------------------------
  // Submit
  // -----------------------------

  const submit = (e) => {

    e.preventDefault();

    onSubmit(formData);

  };

  return (

    <form onSubmit={submit}>

      <div className="row">

        <div className="col-md-4 mb-3">

          <label className="form-label">

            State

          </label>

          <select
            className="form-select"
            value={formData.state}
            onChange={handleStateChange}
          >

            <option value="">Select State</option>

            {states.map((state) => (

              <option
                key={state}
                value={state}
              >

                {state}

              </option>

            ))}

          </select>

        </div>

        <div className="col-md-4 mb-3">

          <label className="form-label">

            City

          </label>

          <select
            className="form-select"
            name="city"
            value={formData.city}
            onChange={handleChange}
          >

            <option value="">Select City</option>

            {cities.map((city) => (

              <option
                key={city}
                value={city}
              >

                {city}

              </option>

            ))}

          </select>

        </div>

        <div className="col-md-4 mb-3">

          <label className="form-label">

            Month

          </label>

          <select
            className="form-select"
            name="month"
            value={formData.month}
            onChange={handleChange}
          >

            <option value="">

              Select Month

            </option>

            {months.map((month) => (

              <option
                key={month}
                value={month}
              >

                {month}

              </option>

            ))}

          </select>

        </div>

      </div>

      <div className="row">

        <div className="col-md-4 mb-3">

          <label>Temperature</label>

          <input
            className="form-control"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
          />

        </div>

        <div className="col-md-4 mb-3">

          <label>Humidity</label>

          <input
            className="form-control"
            name="humidity"
            value={formData.humidity}
            onChange={handleChange}
          />

        </div>

        <div className="col-md-4 mb-3">

          <label>Rainfall</label>

          <input
            className="form-control"
            name="rainfall"
            value={formData.rainfall}
            onChange={handleChange}
          />

        </div>

      </div>

      <div className="row">

        <div className="col-md-3 mb-3">

          <label>Nitrogen (N)</label>

          <input
            className="form-control"
            name="N"
            value={formData.N}
            onChange={handleChange}
          />

        </div>

        <div className="col-md-3 mb-3">

          <label>Phosphorus (P)</label>

          <input
            className="form-control"
            name="P"
            value={formData.P}
            onChange={handleChange}
          />

        </div>

        <div className="col-md-3 mb-3">

          <label>Potassium (K)</label>

          <input
            className="form-control"
            name="K"
            value={formData.K}
            onChange={handleChange}
          />

        </div>

        <div className="col-md-3 mb-3">

          <label>pH</label>

          <input
            className="form-control"
            name="ph"
            value={formData.ph}
            onChange={handleChange}
          />

        </div>

      </div>

      <div className="row">

        <div className="col-md-6 mb-3">

          <label>Soil Type</label>

          <select
            className="form-select"
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
          >

            <option value="">

              Select Soil

            </option>

            {soilTypes.map((soil) => (

              <option
                key={soil}
                value={soil}
              >

                {soil}

              </option>

            ))}

          </select>

        </div>

      </div>

      <button
        className="btn btn-success"
        type="submit"
      >

        Recommend Crop

      </button>

    </form>

  );

};

export default ClimateForm;