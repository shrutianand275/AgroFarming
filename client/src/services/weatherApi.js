const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org";

/* ================================
   GET CITY COORDINATES
================================ */
export const getCoordinates = async (city, state) => {
  if (!API_KEY) {
    throw new Error("OpenWeather API key is missing.");
  }

  const url =
    `${BASE_URL}/geo/1.0/direct` +
    `?q=${encodeURIComponent(city)}` +
    `&limit=5` +
    `&appid=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to find the location.");
  }

  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error("Location not found.");
  }

  // Match state entered by user
  const enteredState = state.trim().toLowerCase();

  const stateMatch = data.find(
    (location) =>
      location.state &&
      location.state.toLowerCase().includes(enteredState)
  );

  // If state doesn't match exactly, use first city result
  return stateMatch || data[0];
};


/* ================================
   GET WEATHER DATA
================================ */
export const getWeather = async (
  latitude,
  longitude,
  language = "en"
) => {
  if (!API_KEY) {
    throw new Error("OpenWeather API key is missing.");
  }

  const url =
    `${BASE_URL}/data/3.0/onecall` +
    `?lat=${latitude}` +
    `&lon=${longitude}` +
    `&exclude=minutely,hourly` +
    `&units=metric` +
    `&lang=${language}` +
    `&appid=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Unable to fetch weather data."
    );
  }

  return await response.json();
};


/* ================================
   GET WEATHER BY CITY + STATE
================================ */
export const getWeatherByLocation = async (
  city,
  state,
  language = "en"
) => {
  const location = await getCoordinates(city, state);

  const weather = await getWeather(
    location.lat,
    location.lon,
    language
  );

  return {
    location,
    weather
  };
};