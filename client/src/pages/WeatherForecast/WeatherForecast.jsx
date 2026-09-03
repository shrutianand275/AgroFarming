import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar/Navbar";

import {
  Search,
  MapPin,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  Cloud,
  CloudSun,
  CloudLightning,
  Snowflake,
  Sprout,
  AlertCircle
} from "lucide-react";

import { getWeatherByLocation } from "../../services/weatherApi";

import "./WeatherForecast.css";


const WeatherForecast = () => {
  const { t, i18n } = useTranslation();

  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");


  /* ================================
     WEATHER ICON
  ================================= */
  const getWeatherIcon = (weatherId, size = 32) => {

    if (weatherId >= 200 && weatherId < 300) {
      return <CloudLightning size={size} />;
    }

    if (weatherId >= 300 && weatherId < 400) {
      return <CloudRain size={size} />;
    }

    if (weatherId >= 500 && weatherId < 600) {
      return <CloudRain size={size} />;
    }

    if (weatherId >= 600 && weatherId < 700) {
      return <Snowflake size={size} />;
    }

    if (weatherId >= 700 && weatherId < 800) {
      return <Cloud size={size} />;
    }

    if (weatherId === 800) {
      return <Sun size={size} />;
    }

    if (weatherId === 801) {
      return <CloudSun size={size} />;
    }

    if (weatherId > 801) {
      return <Cloud size={size} />;
    }

    return <Sun size={size} />;
  };


  /* ================================
     FARMING ADVISORY
  ================================= */
  const getAdvisory = (current, today) => {

    const temperature = current.temp;
    const humidity = current.humidity;
    const windSpeed = current.wind_speed * 3.6;

    const rainProbability = (today.pop || 0) * 100;
    const rainfall = today.rain || 0;

    const advice = [];

    if (rainProbability >= 60 || rainfall > 5) {
      advice.push(t("weather.advice.rainExpected"));
    }

    if (rainProbability <= 20 && temperature >= 30) {
      advice.push(t("weather.advice.hotDry"));
    }

    if (humidity >= 80) {
      advice.push(t("weather.advice.highHumidity"));
    }

    if (temperature >= 35) {
      advice.push(t("weather.advice.highTemperature"));
    }

    if (windSpeed >= 30) {
      advice.push(t("weather.advice.strongWind"));
    }

    if (rainProbability >= 70) {
      advice.push(t("weather.advice.heavyRain"));
    }

    if (advice.length === 0) {
      advice.push(t("weather.advice.normal"));
    }

    return advice;
  };


  /* ================================
     SEARCH WEATHER
  ================================= */
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!city.trim() || !state.trim()) {
      setError(t("weather.enterCityState"));
      return;
    }

    setLoading(true);
    setWeatherData(null);
    setError("");

    try {

      const language =
        i18n.language?.startsWith("hi")
          ? "hi"
          : "en";

      const result = await getWeatherByLocation(
        city.trim(),
        state.trim(),
        language
      );

      setWeatherData(result);

    } catch (err) {

      console.error("Weather Error:", err);

      if (
        err.message?.toLowerCase().includes("location")
      ) {
        setError(t("weather.locationNotFound"));
      } else {
        setError(
          err.message || t("weather.weatherError")
        );
      }

    } finally {
      setLoading(false);
    }
  };


  /* ================================
     DATA
  ================================= */
  const current = weatherData?.weather?.current;
  const daily = weatherData?.weather?.daily || [];

  const today = daily[0];

  const currentTemperature = current
    ? Math.round(current.temp)
    : null;

  const humidity = current
    ? current.humidity
    : null;

  const windSpeed = current
    ? Math.round(current.wind_speed * 3.6)
    : null;

  const rainProbability = today
    ? Math.round((today.pop || 0) * 100)
    : null;

  const rainfall = current
    ? Number(current.rain?.["1h"] || 0).toFixed(1)
    : null;


  const advisory =
    current && today
      ? getAdvisory(current, today)
      : [];


  /* ================================
     DATE FORMAT
  ================================= */
  const formatDate = (timestamp) => {

    const locale =
      i18n.language?.startsWith("hi")
        ? "hi-IN"
        : "en-IN";

    return new Date(timestamp * 1000).toLocaleDateString(
      locale,
      {
        weekday: "short",
        day: "numeric",
        month: "short"
      }
    );
  };


  return (
    <>
      <Navbar />

      <main className="weather-page">

        <div className="weather-container">

          {/* ================= HEADER ================= */}
          <div className="weather-header">

            <h1 className="weather-title">
              {t("weather.title")}
            </h1>

            <p className="weather-subtitle">
              {t("weather.subtitle")}
            </p>

          </div>


          {/* ================= SEARCH CARD ================= */}
          <div className="weather-card">

            <form
              className="weather-form"
              onSubmit={handleSearch}
            >

              <div className="weather-grid">

                {/* CITY */}
                <div className="weather-field">

                  <label>
                    <MapPin size={16} />
                    {t("weather.city")}
                  </label>

                  <input
                    type="text"
                    value={city}
                    onChange={(e) =>
                      setCity(e.target.value)
                    }
                    placeholder={t(
                      "weather.cityPlaceholder"
                    )}
                  />

                </div>


                {/* STATE */}
                <div className="weather-field">

                  <label>
                    <MapPin size={16} />
                    {t("weather.state")}
                  </label>

                  <input
                    type="text"
                    value={state}
                    onChange={(e) =>
                      setState(e.target.value)
                    }
                    placeholder={t(
                      "weather.statePlaceholder"
                    )}
                  />

                </div>

              </div>


              <div className="weather-action">

                <button
                  type="submit"
                  className="weather-search-btn"
                  disabled={loading}
                >

                  <Search size={18} />

                  {loading
                    ? t("weather.loading")
                    : t("weather.getWeather")}

                </button>

              </div>

            </form>

          </div>


          {/* ================= ERROR ================= */}
          {error && (

            <div className="weather-error">

              <AlertCircle size={20} />

              <span>{error}</span>

            </div>

          )}


          {/* ================= RESULTS ================= */}
          {weatherData && current && (

            <>

              {/* LOCATION */}
              <div className="weather-location">

                <MapPin size={18} />

                <span>
                  {weatherData.location.name}
                  {weatherData.location.state
                    ? `, ${weatherData.location.state}`
                    : ""}
                </span>

              </div>


              {/* ================= CURRENT WEATHER ================= */}
              <section className="weather-card current-weather-card">

                <div className="section-header">

                  <div>
                    <h2>
                      {t("weather.currentWeather")}
                    </h2>
                  </div>

                </div>


                <div className="current-weather-main">

                  {/* TEMPERATURE */}
                  <div className="current-weather-summary">

                    <div className="current-weather-icon">

                      {getWeatherIcon(
                        current.weather?.[0]?.id,
                        58
                      )}

                    </div>

                    <div>

                      <div className="current-temperature">

                        {currentTemperature}
                        {t("weather.units.celsius")}

                      </div>

                      <div className="current-condition">

                        {current.weather?.[0]?.description ||
                          t("weather.conditions.unknown")}

                      </div>

                    </div>

                  </div>


                  {/* DETAILS */}
                  <div className="weather-details">

                    <div className="weather-detail">

                      <Droplets size={21} />

                      <div>
                        <span>
                          {t("weather.humidity")}
                        </span>

                        <strong>
                          {humidity}
                          {t("weather.units.percent")}
                        </strong>
                      </div>

                    </div>


                    <div className="weather-detail">

                      <CloudRain size={21} />

                      <div>
                        <span>
                          {t("weather.rainProbability")}
                        </span>

                        <strong>
                          {rainProbability}
                          {t("weather.units.percent")}
                        </strong>
                      </div>

                    </div>


                    <div className="weather-detail">

                      <Wind size={21} />

                      <div>
                        <span>
                          {t("weather.windSpeed")}
                        </span>

                        <strong>
                          {windSpeed}
                          {" "}
                          {t("weather.units.kmh")}
                        </strong>
                      </div>

                    </div>


                    <div className="weather-detail">

                      <CloudRain size={21} />

                      <div>
                        <span>
                          {t("weather.rainfall")}
                        </span>

                        <strong>
                          {rainfall}
                          {" "}
                          {t("weather.units.mm")}
                        </strong>
                      </div>

                    </div>

                  </div>

                </div>

              </section>


              {/* ================= 7 DAY FORECAST ================= */}
              <section className="forecast-section">

                <div className="section-header">

                  <div>

                    <h2>
                      {t("weather.sevenDayForecast")}
                    </h2>

                    <p>
                      {t("weather.upcomingWeather")}
                    </p>

                  </div>

                </div>


                <div className="forecast-grid">

                  {daily.slice(0, 7).map((day, index) => {

                    const weather =
                      day.weather?.[0];

                    const maxTemp =
                      Math.round(day.temp.max);

                    const minTemp =
                      Math.round(day.temp.min);

                    const rain =
                      Math.round((day.pop || 0) * 100);

                    return (

                      <div
                        className={`forecast-card ${
                          index === 0
                            ? "forecast-today"
                            : ""
                        }`}
                        key={day.dt}
                      >

                        <div className="forecast-day">

                          {index === 0
                            ? t("weather.today")
                            : formatDate(day.dt)}

                        </div>


                        <div className="forecast-icon">

                          {getWeatherIcon(
                            weather?.id,
                            38
                          )}

                        </div>


                        <div className="forecast-condition">

                          {weather?.description ||
                            t(
                              "weather.conditions.unknown"
                            )}

                        </div>


                        <div className="forecast-temperature">

                          <strong>
                            {maxTemp}°
                          </strong>

                          <span>
                            {minTemp}°
                          </span>

                        </div>


                        <div className="forecast-rain">

                          <CloudRain size={15} />

                          {rain}
                          {t("weather.units.percent")}

                        </div>

                      </div>

                    );

                  })}

                </div>

              </section>


              {/* ================= FARMING ADVISORY ================= */}
              <section className="weather-card farming-advisory">

                <div className="advisory-header">

                  <div className="advisory-icon">

                    <Sprout size={25} />

                  </div>

                  <div>

                    <h2>
                      {t("weather.farmingAdvisory")}
                    </h2>

                    <p>
                      {t("weather.advisorySubtitle")}
                    </p>

                  </div>

                </div>


                <div className="advisory-list">

                  {advisory.map((item, index) => (

                    <div
                      className="advisory-item"
                      key={index}
                    >

                      <span className="advisory-number">
                        {index + 1}
                      </span>

                      <p>{item}</p>

                    </div>

                  ))}

                </div>

              </section>

            </>

          )}

        </div>

      </main>
    </>
  );
};

export default WeatherForecast;