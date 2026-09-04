const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

/* =========================================
   GET CITY + STATE COORDINATES
========================================= */

export const getCoordinates = async (city, state) => {
  const query = `${city}, ${state}, India`;

  const url =
    `${GEOCODING_URL}` +
    `?name=${encodeURIComponent(query)}` +
    `&count=10` +
    `&language=en` +
    `&countryCode=IN` +
    `&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to find the location.");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("Location not found.");
  }

  const enteredState = state.trim().toLowerCase();

  // Try to find the result matching the entered state
  const stateMatch = data.results.find((location) => {
    const admin1 = location.admin1?.toLowerCase() || "";

    return (
      admin1.includes(enteredState) ||
      enteredState.includes(admin1)
    );
  });

  return stateMatch || data.results[0];
};


/* =========================================
   GET REAL WEATHER DATA
========================================= */

export const getWeather = async (
  latitude,
  longitude
) => {

  const url =
    `${WEATHER_URL}` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=` +
    `temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m` +
    `&daily=` +
    `temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,precipitation_probability_max,weather_code,wind_speed_10m_max` +
    `&temperature_unit=celsius` +
    `&wind_speed_unit=kmh` +
    `&precipitation_unit=mm` +
    `&forecast_days=7` +
    `&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to fetch weather data.");
  }

  return await response.json();
};


/* =========================================
   GET WEATHER BY CITY + STATE
========================================= */

export const getWeatherByLocation = async (
  city,
  state
) => {

  const location = await getCoordinates(
    city,
    state
  );

  const weather = await getWeather(
    location.latitude,
    location.longitude
  );

  return {
    location,
    weather
  };
};