// ============================================================
// SEASONAL CLIMATE ANALYSIS API
// ------------------------------------------------------------
// Historical data:
// Open-Meteo Archive API
//
// Future seasonal prediction:
// Open-Meteo Seasonal Forecast API
//
// Current year:
//   Available actual data + seasonal forecast
//
// Previous year:
//   Full actual historical data
// ============================================================

const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const ARCHIVE_URL =
  "https://archive-api.open-meteo.com/v1/archive";

const SEASONAL_URL =
  "https://seasonal-api.open-meteo.com/v1/seasonal";

// ============================================================
// LOCATION
// ============================================================

export async function getCityCoordinates(city, state = "") {
  if (!city) {
    throw new Error("City is required");
  }

  const searchText = state
    ? `${city}, ${state}, India`
    : `${city}, India`;

  const url =
    `${GEOCODING_URL}?name=${encodeURIComponent(searchText)}` +
    `&count=10&language=en&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to find city location");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City location not found");
  }

  const indiaResult =
    data.results.find(
      (item) =>
        item.country_code === "IN" ||
        item.country === "India"
    ) || data.results[0];

  return {
    latitude: indiaResult.latitude,
    longitude: indiaResult.longitude,
    name: indiaResult.name,
    country: indiaResult.country
  };
}

// ============================================================
// DATE HELPERS
// ============================================================

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getPreviousYearRange() {
  const now = new Date();

  const currentYear = now.getUTCFullYear();
  const previousYear = currentYear - 1;

  return {
    previousYear,
    start: `${previousYear}-01-01`,
    end: `${previousYear}-12-31`
  };
}

// ============================================================
// MONTH NAMES
// ============================================================

const MONTHS = [
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

function getMonthName(month) {
  const number = Number(month);

  if (
    !Number.isInteger(number) ||
    number < 1 ||
    number > 12
  ) {
    return "Unknown";
  }

  return MONTHS[number - 1];
}

// ============================================================
// HISTORICAL DATA
// ============================================================

async function fetchHistoricalData(
  latitude,
  longitude,
  startDate,
  endDate
) {
  const url =
    `${ARCHIVE_URL}?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&start_date=${startDate}` +
    `&end_date=${endDate}` +
    `&daily=` +
    `temperature_2m_mean,` +
    `temperature_2m_max,` +
    `temperature_2m_min,` +
    `precipitation_sum,` +
    `rain_sum,` +
    `wind_speed_10m_max,` +
    `relative_humidity_2m_mean` +
    `&temperature_unit=celsius` +
    `&wind_speed_unit=kmh` +
    `&precipitation_unit=mm` +
    `&timezone=auto`;

  console.log("Historical API URL:", url);

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    console.error("Historical API Error:", data);

    throw new Error(
      data?.reason ||
      data?.error ||
      `Historical weather API error: ${response.status}`
    );
  }

  return data;
}

// ============================================================
// SEASONAL FORECAST
// ============================================================

async function fetchSeasonalForecast(
  latitude,
  longitude
) {
  /*
   * IMPORTANT:
   * Monthly precipitation uses precipitation_mean.
   *
   * Daily precipitation uses precipitation_sum.
   */

  const url =
    `${SEASONAL_URL}?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&models=ecmwf_seasonal_ensemble_mean_seamless` +
    `&daily=` +
    `temperature_2m_mean,` +
    `temperature_2m_max,` +
    `temperature_2m_min,` +
    `relative_humidity_2m_mean,` +
    `precipitation_sum,` +
    `wind_speed_10m_mean` +
    `&monthly=` +
    `temperature_2m_mean,` +
    `temperature_2m_anomaly,` +
    `precipitation_mean,` +
    `precipitation_anomaly,` +
    `wind_speed_10m_mean,` +
    `wind_speed_10m_anomaly` +
    `&temperature_unit=celsius` +
    `&wind_speed_unit=kmh` +
    `&precipitation_unit=mm` +
    `&timezone=auto`;

  console.log("Seasonal Forecast URL:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("Seasonal API Error:", data);

      throw new Error(
        data?.reason ||
        data?.error ||
        `Seasonal forecast API error: ${response.status}`
      );
    }

    console.log(
      "Seasonal Forecast Response:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "Seasonal Forecast Fetch Error:",
      error
    );

    throw error;
  }
}

// ============================================================
// NUMBER HELPERS
// ============================================================

function average(values) {
  const valid = values
    .map(Number)
    .filter((value) =>
      Number.isFinite(value)
    );

  if (!valid.length) {
    return null;
  }

  return (
    valid.reduce(
      (sum, value) => sum + value,
      0
    ) / valid.length
  );
}

function sum(values) {
  const valid = values
    .map(Number)
    .filter((value) =>
      Number.isFinite(value)
    );

  if (!valid.length) {
    return null;
  }

  return valid.reduce(
    (total, value) => total + value,
    0
  );
}

function round(value, decimals = 1) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return null;
  }

  return Number(
    Number(value).toFixed(decimals)
  );
}

// ============================================================
// HISTORICAL DAILY -> MONTHLY
// ============================================================

function createHistoricalMonthlyData(data) {
  if (!data?.daily?.time) {
    return [];
  }

  const daily = data.daily;
  const months = {};

  daily.time.forEach((date, index) => {
    const month = Number(
      date.substring(5, 7)
    );

    if (!months[month]) {
      months[month] = {
        temperatures: [],
        humidity: [],
        rainfall: [],
        wind: []
      };
    }

    const temperature = Number(
      daily.temperature_2m_mean?.[index]
    );

    const humidity = Number(
      daily.relative_humidity_2m_mean?.[index]
    );

    /*
     * IMPORTANT:
     * Historical daily rainfall is precipitation_sum.
     */
    const rainfall = Number(
      daily.precipitation_sum?.[index]
    );

    const wind = Number(
      daily.wind_speed_10m_max?.[index]
    );

    if (Number.isFinite(temperature)) {
      months[month].temperatures.push(
        temperature
      );
    }

    if (Number.isFinite(humidity)) {
      months[month].humidity.push(
        humidity
      );
    }

    if (Number.isFinite(rainfall)) {
      months[month].rainfall.push(
        rainfall
      );
    }

    if (Number.isFinite(wind)) {
      months[month].wind.push(
        wind
      );
    }
  });

  return Object.keys(months).map(
    (month) => {
      const monthNumber = Number(month);

      const item = months[month];

      return {
        month: monthNumber,
        monthNumber: monthNumber,
        monthName: getMonthName(monthNumber),

        temperature: round(
          average(item.temperatures)
        ),

        humidity: round(
          average(item.humidity)
        ),

        rainfall: round(
          sum(item.rainfall)
        ),

        windSpeed: round(
          average(item.wind)
        ),

        type: "actual",
        isForecast: false
      };
    }
  );
}

// ============================================================
// FORECAST MONTHLY DATA
// ============================================================

function createForecastMonthlyData(data) {
  if (!data?.monthly?.time) {
    return [];
  }

  const monthly = data.monthly;

  return monthly.time.map(
    (date, index) => {
      const monthNumber = Number(
        date.substring(5, 7)
      );

      return {
        month: monthNumber,
        monthNumber: monthNumber,
        monthName: getMonthName(monthNumber),

        date: date,

        temperature: round(
          Number(
            monthly.temperature_2m_mean?.[index]
          )
        ),

        temperatureAnomaly: round(
          Number(
            monthly.temperature_2m_anomaly?.[index]
          )
        ),

        /*
         * Seasonal API does not provide
         * long-range monthly humidity directly.
         *
         * It is filled later when daily humidity
         * is available.
         */
        humidity: null,

        /*
         * IMPORTANT:
         * Seasonal monthly rainfall = precipitation_mean
         */
        rainfall: round(
          Number(
            monthly.precipitation_mean?.[index]
          )
        ),

        rainfallAnomaly: round(
          Number(
            monthly.precipitation_anomaly?.[index]
          )
        ),

        windSpeed: round(
          Number(
            monthly.wind_speed_10m_mean?.[index]
          )
        ),

        windAnomaly: round(
          Number(
            monthly.wind_speed_10m_anomaly?.[index]
          )
        ),

        type: "forecast",
        isForecast: true
      };
    }
  );
}

// ============================================================
// FORECAST DAILY HUMIDITY
// ============================================================

function addForecastHumidity(
  forecastData,
  monthlyData
) {
  if (
    !forecastData?.daily?.time ||
    !forecastData?.daily
      ?.relative_humidity_2m_mean
  ) {
    return monthlyData;
  }

  const humidityByMonth = {};

  forecastData.daily.time.forEach(
    (date, index) => {
      const month = Number(
        date.substring(5, 7)
      );

      const humidity = Number(
        forecastData.daily
          .relative_humidity_2m_mean[index]
      );

      if (!Number.isFinite(humidity)) {
        return;
      }

      if (!humidityByMonth[month]) {
        humidityByMonth[month] = [];
      }

      humidityByMonth[month].push(
        humidity
      );
    }
  );

  return monthlyData.map(
    (item) => ({
      ...item,

      humidity: round(
        average(
          humidityByMonth[
            item.monthNumber
          ] || []
        )
      )
    })
  );
}

// ============================================================
// PERCENTAGE CHANGE
// ============================================================

function percentageChange(
  current,
  previous
) {
  if (
    current === null ||
    previous === null ||
    !Number.isFinite(Number(current)) ||
    !Number.isFinite(Number(previous)) ||
    Number(previous) === 0
  ) {
    return null;
  }

  return round(
    ((current - previous) /
      Math.abs(previous)) *
      100
  );
}

// ============================================================
// CLIMATE STATUS
// ============================================================

function getStatus(change) {
  if (change === null) {
    return "notAvailable";
  }

  if (change > 10) {
    return "increasing";
  }

  if (change < -10) {
    return "decreasing";
  }

  return "normal";
}

// ============================================================
// COMPARE CURRENT VS PREVIOUS
// ============================================================

function compareMonth(
  current,
  previous
) {
  const temperatureChange =
    percentageChange(
      current.temperature,
      previous.temperature
    );

  const humidityChange =
    percentageChange(
      current.humidity,
      previous.humidity
    );

  const rainfallChange =
    percentageChange(
      current.rainfall,
      previous.rainfall
    );

  const windChange =
    percentageChange(
      current.windSpeed,
      previous.windSpeed
    );

  return {
    temperature: {
      current: current.temperature,
      previous: previous.temperature,
      change: temperatureChange,
      status:
        getStatus(
          temperatureChange
        )
    },

    humidity: {
      current: current.humidity,
      previous: previous.humidity,
      change: humidityChange,
      status:
        getStatus(
          humidityChange
        )
    },

    rainfall: {
      current: current.rainfall,
      previous: previous.rainfall,
      change: rainfallChange,
      status:
        getStatus(
          rainfallChange
        )
    },

    windSpeed: {
      current: current.windSpeed,
      previous: previous.windSpeed,
      change: windChange,
      status:
        getStatus(windChange)
    }
  };
}

// ============================================================
// BUILD MONTHLY ANALYSIS
// ============================================================

function buildMonthlyAnalysis(
  previousMonthly,
  currentActualMonthly,
  forecastMonthly
) {
  const now = new Date();

  const completedMonth =
    now.getUTCMonth() + 1;

  const currentMap = {};

  /*
   * First add actual data.
   */
  currentActualMonthly.forEach(
    (item) => {
      const monthNumber =
        Number(item.monthNumber ?? item.month);

      currentMap[monthNumber] = {
        ...item,

        month: monthNumber,
        monthNumber: monthNumber,
        monthName:
          item.monthName ||
          getMonthName(monthNumber)
      };
    }
  );

  /*
   * Forecast replaces current/future
   * full-month values.
   */
  forecastMonthly.forEach(
    (item) => {
      const monthNumber =
        Number(item.monthNumber ?? item.month);

      if (
        monthNumber >= completedMonth
      ) {
        currentMap[monthNumber] = {
          ...item,

          month: monthNumber,
          monthNumber: monthNumber,
          monthName:
            item.monthName ||
            getMonthName(monthNumber)
        };
      }
    }
  );

  const previousMap = {};

  previousMonthly.forEach(
    (item) => {
      const monthNumber =
        Number(item.monthNumber ?? item.month);

      previousMap[monthNumber] = {
        ...item,

        month: monthNumber,
        monthNumber: monthNumber,
        monthName:
          item.monthName ||
          getMonthName(monthNumber)
      };
    }
  );

  /*
   * ALWAYS create all 12 months.
   */
  return MONTHS.map(
    (monthName, index) => {
      const monthNumber = index + 1;

      const current =
        currentMap[monthNumber] || {
          month: monthNumber,
          monthNumber: monthNumber,
          monthName: monthName,

          temperature: null,
          humidity: null,
          rainfall: null,
          windSpeed: null,

          type: "forecast",
          isForecast: true
        };

      const previous =
        previousMap[monthNumber] || {
          month: monthNumber,
          monthNumber: monthNumber,
          monthName: monthName,

          temperature: null,
          humidity: null,
          rainfall: null,
          windSpeed: null,

          type: "actual",
          isForecast: false
        };

      return {
        /*
         * These THREE fields make the month
         * available to the React component.
         */
        month: monthNumber,
        monthNumber: monthNumber,
        monthName: monthName,

        current: {
          ...current,

          month: monthNumber,
          monthNumber: monthNumber,
          monthName: monthName
        },

        previous: {
          ...previous,

          month: monthNumber,
          monthNumber: monthNumber,
          monthName: monthName
        },

        comparison:
          compareMonth(
            current,
            previous
          ),

        dataType:
          current.type,

        isForecast:
          current.type === "forecast"
      };
    }
  );
}

// ============================================================
// QUARTERLY ANALYSIS
// ============================================================

function buildQuarterlyAnalysis(
  monthly
) {
  const quarters = [
    {
      quarter: 1,
      months: [1, 2, 3]
    },
    {
      quarter: 2,
      months: [4, 5, 6]
    },
    {
      quarter: 3,
      months: [7, 8, 9]
    },
    {
      quarter: 4,
      months: [10, 11, 12]
    }
  ];

  return quarters.map(
    (quarter) => {
      const records =
        monthly.filter(
          (item) =>
            quarter.months.includes(
              item.monthNumber
            )
        );

      const current = {
        temperature: round(
          average(
            records.map(
              (item) =>
                item.current
                  .temperature
            )
          )
        ),

        humidity: round(
          average(
            records.map(
              (item) =>
                item.current
                  .humidity
            )
          )
        ),

        rainfall: round(
          sum(
            records.map(
              (item) =>
                item.current
                  .rainfall
            )
          )
        ),

        windSpeed: round(
          average(
            records.map(
              (item) =>
                item.current
                  .windSpeed
            )
          )
        )
      };

      const previous = {
        temperature: round(
          average(
            records.map(
              (item) =>
                item.previous
                  .temperature
            )
          )
        ),

        humidity: round(
          average(
            records.map(
              (item) =>
                item.previous
                  .humidity
            )
          )
        ),

        rainfall: round(
          sum(
            records.map(
              (item) =>
                item.previous
                  .rainfall
            )
          )
        ),

        windSpeed: round(
          average(
            records.map(
              (item) =>
                item.previous
                  .windSpeed
            )
          )
        )
      };

      return {
        quarter:
          quarter.quarter,

        months:
          quarter.months,

        current,

        previous,

        comparison:
          compareMonth(
            current,
            previous
          ),

        isForecast:
          records.some(
            (item) =>
              item.isForecast
          )
      };
    }
  );
}

// ============================================================
// SEASONAL ANALYSIS
// ============================================================

const SEASONS = [
  {
    key: "winter",
    months: [12, 1, 2]
  },
  {
    key: "summer",
    months: [3, 4, 5]
  },
  {
    key: "monsoon",
    months: [6, 7, 8, 9]
  },
  {
    key: "postMonsoon",
    months: [10, 11]
  }
];

function buildSeasonalAnalysis(
  monthly
) {
  const result = {};

  SEASONS.forEach(
    (season) => {
      const records =
        monthly.filter(
          (item) =>
            season.months.includes(
              item.monthNumber
            )
        );

      const current = {
        temperature: round(
          average(
            records.map(
              (item) =>
                item.current
                  .temperature
            )
          )
        ),

        humidity: round(
          average(
            records.map(
              (item) =>
                item.current
                  .humidity
            )
          )
        ),

        rainfall: round(
          sum(
            records.map(
              (item) =>
                item.current
                  .rainfall
            )
          )
        ),

        windSpeed: round(
          average(
            records.map(
              (item) =>
                item.current
                  .windSpeed
            )
          )
        )
      };

      const previous = {
        temperature: round(
          average(
            records.map(
              (item) =>
                item.previous
                  .temperature
            )
          )
        ),

        humidity: round(
          average(
            records.map(
              (item) =>
                item.previous
                  .humidity
            )
          )
        ),

        rainfall: round(
          sum(
            records.map(
              (item) =>
                item.previous
                  .rainfall
            )
          )
        ),

        windSpeed: round(
          average(
            records.map(
              (item) =>
                item.previous
                  .windSpeed
            )
          )
        )
      };

      result[season.key] = {
        current,
        previous,

        comparison:
          compareMonth(
            current,
            previous
          ),

        isForecast:
          records.some(
            (item) =>
              item.isForecast
          )
      };
    }
  );

  return result;
}

// ============================================================
// FARMING ADVISORY
// ============================================================

function generateFarmingAdvisory(
  monthly
) {
  const futureMonths =
    monthly.filter(
      (item) =>
        item.isForecast === true
    );

  const forecastTemperatures =
    futureMonths
      .map(
        (item) =>
          item.current.temperature
      )
      .filter(
        (value) =>
          Number.isFinite(value)
      );

  const forecastRainfall =
    futureMonths
      .map(
        (item) =>
          item.current.rainfall
      )
      .filter(
        (value) =>
          Number.isFinite(value)
      );

  const averageTemperature =
    average(
      forecastTemperatures
    );

  const averageRainfall =
    average(
      forecastRainfall
    );

  const advice = [];
  const crops = [];

  if (
    averageTemperature !== null &&
    averageTemperature >= 32
  ) {
    advice.push(
      "highTemperature"
    );

    crops.push(
      "Pearl millet",
      "Sorghum",
      "Groundnut"
    );
  }

  if (
    averageRainfall !== null &&
    averageRainfall < 300
  ) {
    advice.push(
      "lowRainfall"
    );

    crops.push(
      "Pearl millet",
      "Sorghum",
      "Chickpea"
    );
  }

  if (
    averageRainfall !== null &&
    averageRainfall > 700
  ) {
    advice.push(
      "highRainfall"
    );

    crops.push(
      "Rice",
      "Maize",
      "Soybean"
    );
  }

  if (
    averageTemperature !== null &&
    averageTemperature >= 20 &&
    averageTemperature < 30 &&
    averageRainfall !== null &&
    averageRainfall >= 300 &&
    averageRainfall <= 700
  ) {
    advice.push(
      "balancedClimate"
    );

    crops.push(
      "Wheat",
      "Maize",
      "Pulses"
    );
  }

  if (advice.length === 0) {
    advice.push("normal");

    crops.push(
      "Wheat",
      "Pulses"
    );
  }

  return {
    advice: [
      ...new Set(advice)
    ],

    crops: [
      ...new Set(crops)
    ]
  };
}

// ============================================================
// MAIN FUNCTION
// ============================================================

export async function getSeasonalClimateAnalysis(
  city,
  state = ""
) {
  const location =
    await getCityCoordinates(
      city,
      state
    );

  const now = new Date();

  const currentYear =
    now.getUTCFullYear();

  const previousYear =
    currentYear - 1;

  /*
   * Current year:
   * January 1 -> yesterday
   */

  const currentStart =
    `${currentYear}-01-01`;

  const yesterday =
    new Date(now);

  yesterday.setUTCDate(
    yesterday.getUTCDate() - 1
  );

  const currentEnd =
    formatDate(yesterday);

  const previousRange =
    getPreviousYearRange();

  /*
   * Fetch all three data sources.
   */

  const [
    previousData,
    currentActualData,
    seasonalForecastData
  ] = await Promise.all([
    fetchHistoricalData(
      location.latitude,
      location.longitude,
      previousRange.start,
      previousRange.end
    ),

    fetchHistoricalData(
      location.latitude,
      location.longitude,
      currentStart,
      currentEnd
    ),

    fetchSeasonalForecast(
      location.latitude,
      location.longitude
    )
  ]);

  // ==========================================================
  // PREVIOUS YEAR
  // ==========================================================

  const previousMonthly =
    createHistoricalMonthlyData(
      previousData
    );

  // ==========================================================
  // CURRENT YEAR ACTUAL
  // ==========================================================

  const currentActualMonthly =
    createHistoricalMonthlyData(
      currentActualData
    );

  // ==========================================================
  // FUTURE FORECAST
  // ==========================================================

  let forecastMonthly =
    createForecastMonthlyData(
      seasonalForecastData
    );

  forecastMonthly =
    addForecastHumidity(
      seasonalForecastData,
      forecastMonthly
    );

  // ==========================================================
  // MONTHLY
  // ==========================================================

  const monthly =
    buildMonthlyAnalysis(
      previousMonthly,
      currentActualMonthly,
      forecastMonthly
    );

  // ==========================================================
  // QUARTERLY
  // ==========================================================

  const quarterly =
    buildQuarterlyAnalysis(
      monthly
    );

  // ==========================================================
  // SEASONAL
  // ==========================================================

  const seasonal =
    buildSeasonalAnalysis(
      monthly
    );

  // ==========================================================
  // OVERVIEW
  // ==========================================================

  const actualCompletedMonths =
    monthly.filter(
      (item) =>
        !item.isForecast
    );

  const forecastMonths =
    monthly.filter(
      (item) =>
        item.isForecast
    );

  const currentOverview = {
    temperature: round(
      average(
        monthly.map(
          (item) =>
            item.current
              .temperature
        )
      )
    ),

    humidity: round(
      average(
        monthly.map(
          (item) =>
            item.current
              .humidity
        )
      )
    ),

    rainfall: round(
      sum(
        monthly.map(
          (item) =>
            item.current
              .rainfall
        )
      )
    ),

    windSpeed: round(
      average(
        monthly.map(
          (item) =>
            item.current
              .windSpeed
        )
      )
    )
  };

  const previousOverview = {
    temperature: round(
      average(
        monthly.map(
          (item) =>
            item.previous
              .temperature
        )
      )
    ),

    humidity: round(
      average(
        monthly.map(
          (item) =>
            item.previous
              .humidity
        )
      )
    ),

    rainfall: round(
      sum(
        monthly.map(
          (item) =>
            item.previous
              .rainfall
        )
      )
    ),

    windSpeed: round(
      average(
        monthly.map(
          (item) =>
            item.previous
              .windSpeed
        )
      )
    )
  };

  const comparison =
    compareMonth(
      currentOverview,
      previousOverview
    );

  // ==========================================================
  // FARMING ADVISORY
  // ==========================================================

  const farmingAdvisory =
    generateFarmingAdvisory(
      monthly
    );

  // ==========================================================
  // FINAL RESULT
  // ==========================================================

  return {
    location,

    years: {
      current: currentYear,
      previous: previousYear
    },

    dateRange: {
      currentStart,
      currentEnd,

      previousStart:
        previousRange.start,

      previousEnd:
        previousRange.end
    },

    current:
      currentOverview,

    previous:
      previousOverview,

    comparison,

    /*
     * Each item now ALWAYS contains:
     * month
     * monthNumber
     * monthName
     */
    monthly,

    quarterly,

    seasonal,

    farmingAdvisory,

    completedMonths:
      actualCompletedMonths.length,

    forecastMonths:
      forecastMonths.length
  };
}