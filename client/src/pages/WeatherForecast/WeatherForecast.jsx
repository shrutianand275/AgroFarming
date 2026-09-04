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


  /* =========================================
     WMO WEATHER CODE
  ========================================= */

  const getWeatherInfo = (code) => {

    if (code === 0) {
      return {
        key: "clearSky",
        icon: <Sun />
      };
    }

    if (code === 1) {
      return {
        key: "mainlyClear",
        icon: <Sun />
      };
    }

    if (code === 2) {
      return {
        key: "partlyCloudy",
        icon: <CloudSun />
      };
    }

    if (code === 3) {
      return {
        key: "cloudy",
        icon: <Cloud />
      };
    }

    if (code === 45 || code === 48) {
      return {
        key: "foggy",
        icon: <Cloud />
      };
    }

    if (
      code === 51 ||
      code === 53 ||
      code === 55 ||
      code === 56 ||
      code === 57
    ) {
      return {
        key: "drizzle",
        icon: <CloudRain />
      };
    }

    if (
      code === 61 ||
      code === 63 ||
      code === 65 ||
      code === 66 ||
      code === 67 ||
      code === 80 ||
      code === 81 ||
      code === 82
    ) {
      return {
        key: "rain",
        icon: <CloudRain />
      };
    }

    if (
      code === 71 ||
      code === 73 ||
      code === 75 ||
      code === 77 ||
      code === 85 ||
      code === 86
    ) {
      return {
        key: "snow",
        icon: <Snowflake />
      };
    }

    if (
      code === 95 ||
      code === 96 ||
      code === 99
    ) {
      return {
        key: "thunderstorm",
        icon: <CloudLightning />
      };
    }

    return {
      key: "unknown",
      icon: <Cloud />
    };
  };


  /* =========================================
     FARMING ADVISORY
  ========================================= */

  const getAdvisory = (current, today) => {

    const temperature = current.temperature_2m;

    const humidity =
      current.relative_humidity_2m;

    const windSpeed =
      current.wind_speed_10m;

    const rainProbability =
      today.precipitation_probability_max || 0;

    const rainfall =
      today.rain_sum || 0;

    const advice = [];


    if (
      rainProbability >= 60 ||
      rainfall > 5
    ) {
      advice.push(
        t("weather.advice.rainExpected")
      );
    }


    if (
      rainProbability <= 20 &&
      temperature >= 30
    ) {
      advice.push(
        t("weather.advice.hotDry")
      );
    }


    if (humidity >= 80) {
      advice.push(
        t("weather.advice.highHumidity")
      );
    }


    if (temperature >= 35) {
      advice.push(
        t("weather.advice.highTemperature")
      );
    }


    if (windSpeed >= 30) {
      advice.push(
        t("weather.advice.strongWind")
      );
    }


    if (rainProbability >= 70) {
      advice.push(
        t("weather.advice.heavyRain")
      );
    }


    if (advice.length === 0) {
      advice.push(
        t("weather.advice.normal")
      );
    }


    return advice;
  };


  /* =========================================
     SEARCH WEATHER
  ========================================= */

  const handleSearch = async (e) => {

    e.preventDefault();

    if (!city.trim() || !state.trim()) {

      setError(
        t("weather.enterCityState")
      );

      return;
    }


    setLoading(true);
    setWeatherData(null);
    setError("");


    try {

      const result =
        await getWeatherByLocation(
          city.trim(),
          state.trim()
        );

      setWeatherData(result);

    } catch (err) {

      console.error(
        "Weather Error:",
        err
      );

      if (
        err.message
          ?.toLowerCase()
          .includes("location")
      ) {

        setError(
          t("weather.locationNotFound")
        );

      } else {

        setError(
          err.message ||
          t("weather.weatherError")
        );
      }

    } finally {

      setLoading(false);

    }
  };


  /* =========================================
     WEATHER DATA
  ========================================= */

  const current =
    weatherData?.weather?.current;

  const daily =
    weatherData?.weather?.daily;


  /* =========================================
     CURRENT VALUES
  ========================================= */

  const temperature =
    current?.temperature_2m;

  const humidity =
    current?.relative_humidity_2m;

  const windSpeed =
    current?.wind_speed_10m;

  const rainfall =
    current?.rain ?? current?.precipitation ?? 0;

  const today =
    daily?.time?.length
      ? {
          precipitation_probability_max:
            daily.precipitation_probability_max?.[0] || 0,

          rain_sum:
            daily.rain_sum?.[0] || 0
        }
      : null;


  const rainProbability =
    today?.precipitation_probability_max || 0;


  /* =========================================
     CURRENT WEATHER INFO
  ========================================= */

  const currentWeatherInfo =
    current
      ? getWeatherInfo(
          current.weather_code
        )
      : null;


  /* =========================================
     7 DAY FORECAST
  ========================================= */

  const forecast = daily?.time
    ? daily.time.map((date, index) => ({
        date,

        maxTemp:
          daily.temperature_2m_max?.[index],

        minTemp:
          daily.temperature_2m_min?.[index],

        rainfall:
          daily.rain_sum?.[index] || 0,

        rainProbability:
          daily.precipitation_probability_max?.[
            index
          ] || 0,

        windSpeed:
          daily.wind_speed_10m_max?.[
            index
          ] || 0,

        weatherCode:
          daily.weather_code?.[index]
      }))
    : [];


  /* =========================================
     DATE FORMAT
  ========================================= */

  const formatDate = (date) => {

    const locale =
      i18n.language?.startsWith("hi")
        ? "hi-IN"
        : "en-IN";

    return new Date(date).toLocaleDateString(
      locale,
      {
        weekday: "short",
        day: "numeric",
        month: "short"
      }
    );
  };


  /* =========================================
     FARMING ADVISORY
  ========================================= */

  const advisory =
    current && today
      ? getAdvisory(
          current,
          today
        )
      : [];


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

              <span>
                {error}
              </span>

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

                  {weatherData.location.admin1
                    ? `, ${weatherData.location.admin1}`
                    : ""}

                </span>

              </div>


              {/* ================= CURRENT WEATHER ================= */}

              <section className="weather-card current-weather-card">

                <div className="section-header">

                  <h2>
                    {t(
                      "weather.currentWeather"
                    )}
                  </h2>

                </div>


                <div className="current-weather-main">

                  {/* SUMMARY */}

                  <div className="current-weather-summary">

                    <div className="current-weather-icon">

                      {currentWeatherInfo &&
                        React.cloneElement(
                          currentWeatherInfo.icon,
                          {
                            size: 58
                          }
                        )}

                    </div>


                    <div>

                      <div className="current-temperature">

                        {Math.round(
                          temperature
                        )}

                        {t(
                          "weather.units.celsius"
                        )}

                      </div>


                      <div className="current-condition">

                        {currentWeatherInfo
                          ? t(
                              `weather.conditions.${currentWeatherInfo.key}`
                            )
                          : t(
                              "weather.conditions.unknown"
                            )}

                      </div>

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="weather-details">

                    {/* HUMIDITY */}

                    <div className="weather-detail">

                      <Droplets size={21} />

                      <div>

                        <span>
                          {t(
                            "weather.humidity"
                          )}
                        </span>

                        <strong>

                          {humidity}

                          {t(
                            "weather.units.percent"
                          )}

                        </strong>

                      </div>

                    </div>


                    {/* RAIN PROBABILITY */}

                    <div className="weather-detail">

                      <CloudRain size={21} />

                      <div>

                        <span>
                          {t(
                            "weather.rainProbability"
                          )}
                        </span>

                        <strong>

                          {rainProbability}

                          {t(
                            "weather.units.percent"
                          )}

                        </strong>

                      </div>

                    </div>


                    {/* WIND */}

                    <div className="weather-detail">

                      <Wind size={21} />

                      <div>

                        <span>
                          {t(
                            "weather.windSpeed"
                          )}
                        </span>

                        <strong>

                          {Math.round(
                            windSpeed
                          )}

                          {" "}

                          {t(
                            "weather.units.kmh"
                          )}

                        </strong>

                      </div>

                    </div>


                    {/* RAINFALL */}

                    <div className="weather-detail">

                      <CloudRain size={21} />

                      <div>

                        <span>
                          {t(
                            "weather.rainfall"
                          )}
                        </span>

                        <strong>

                          {Number(
                            rainfall
                          ).toFixed(1)}

                          {" "}

                          {t(
                            "weather.units.mm"
                          )}

                        </strong>

                      </div>

                    </div>

                  </div>

                </div>

              </section>


              {/* ================= 7 DAY FORECAST ================= */}

              <section className="forecast-section">

                <div className="section-header">

                  <h2>
                    {t(
                      "weather.sevenDayForecast"
                    )}
                  </h2>

                  <p>
                    {t(
                      "weather.upcomingWeather"
                    )}
                  </p>

                </div>


                <div className="forecast-grid">

                  {forecast.map(
                    (day, index) => {

                      const weatherInfo =
                        getWeatherInfo(
                          day.weatherCode
                        );

                      return (

                        <div
                          className={`forecast-card ${
                            index === 0
                              ? "forecast-today"
                              : ""
                          }`}
                          key={day.date}
                        >

                          <div className="forecast-day">

                            {index === 0
                              ? t(
                                  "weather.today"
                                )
                              : formatDate(
                                  day.date
                                )}

                          </div>


                          <div className="forecast-icon">

                            {React.cloneElement(
                              weatherInfo.icon,
                              {
                                size: 38
                              }
                            )}

                          </div>


                          <div className="forecast-condition">

                            {t(
                              `weather.conditions.${weatherInfo.key}`
                            )}

                          </div>


                          <div className="forecast-temperature">

                            <strong>

                              {Math.round(
                                day.maxTemp
                              )}
                              °

                            </strong>

                            <span>

                              {Math.round(
                                day.minTemp
                              )}
                              °

                            </span>

                          </div>


                          <div className="forecast-rain">

                            <CloudRain
                              size={15}
                            />

                            {Math.round(
                              day.rainProbability
                            )}

                            {t(
                              "weather.units.percent"
                            )}

                          </div>

                        </div>

                      );

                    }
                  )}

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
                      {t(
                        "weather.farmingAdvisory"
                      )}
                    </h2>

                    <p>
                      {t(
                        "weather.advisorySubtitle"
                      )}
                    </p>

                  </div>

                </div>


                <div className="advisory-list">

                  {advisory.map(
                    (item, index) => (

                      <div
                        className="advisory-item"
                        key={index}
                      >

                        <span className="advisory-number">

                          {index + 1}

                        </span>

                        <p>
                          {item}
                        </p>

                      </div>

                    )
                  )}

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