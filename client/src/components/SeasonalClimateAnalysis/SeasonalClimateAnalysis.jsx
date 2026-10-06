import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CloudSun,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  TrendingUp,
  TrendingDown,
  Minus,
  Sprout,
  RefreshCw,
  AlertCircle
} from "lucide-react";

import {
  getSeasonalClimateAnalysis
} from "../../services/seasonalClimateApi";

import "./SeasonalClimateAnalysis.css";

export default function SeasonalClimateAnalysis({
  city,
  state = ""
}) {
  const { t, i18n } = useTranslation();

  const [analysis, setAnalysis] = useState(null);
  const [view, setView] = useState("seasonal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ----------------------------------------------------------
  // Load real API data
  // ----------------------------------------------------------
  const loadAnalysis = async () => {
    if (!city) return;

    try {
      setLoading(true);
      setError("");

      const data =
        await getSeasonalClimateAnalysis(
          city,
          state
        );

      setAnalysis(data);
    } catch (err) {
      console.error(
        "Seasonal climate analysis error:",
        err
      );

      setError(
        err?.message ||
        t("seasonalClimate.error")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, [city, state]);

  // ----------------------------------------------------------
  // Current period
  // ----------------------------------------------------------
  const currentPeriod = useMemo(() => {
    if (!analysis) return null;

    return {
      current: analysis.current,
      previous: analysis.previous,
      comparison: analysis.comparison
    };
  }, [analysis]);

  // ----------------------------------------------------------
  // GET MONTH NUMBER - SAFE
  // ----------------------------------------------------------
  const getMonthNumber = (item) => {
    if (!item) return null;

    // Preferred field
    if (
      item.monthNumber !== undefined &&
      item.monthNumber !== null &&
      Number.isFinite(Number(item.monthNumber))
    ) {
      return Number(item.monthNumber);
    }

    // Backup field
    if (
      item.month !== undefined &&
      item.month !== null &&
      Number.isFinite(Number(item.month))
    ) {
      return Number(item.month);
    }

    // Backup using date
    if (item.date) {
      const date = new Date(item.date);

      if (!Number.isNaN(date.getTime())) {
        return date.getUTCMonth() + 1;
      }
    }

    // Backup using time
    if (item.time) {
      const date = new Date(item.time);

      if (!Number.isNaN(date.getTime())) {
        return date.getUTCMonth() + 1;
      }
    }

    return null;
  };

  // ----------------------------------------------------------
  // Icons
  // ----------------------------------------------------------
  const getMetricIcon = (type) => {
    if (type === "temperature") {
      return <Thermometer size={22} />;
    }

    if (type === "humidity") {
      return <Droplets size={22} />;
    }

    if (type === "rainfall") {
      return <CloudRain size={22} />;
    }

    return <Wind size={22} />;
  };

  // ----------------------------------------------------------
  // Status icon
  // ----------------------------------------------------------
  const getStatusIcon = (status) => {
    if (status === "increasing") {
      return <TrendingUp size={17} />;
    }

    if (status === "decreasing") {
      return <TrendingDown size={17} />;
    }

    return <Minus size={17} />;
  };

  // ----------------------------------------------------------
  // Status text
  // ----------------------------------------------------------
  const getStatusText = (status) => {
    if (status === "increasing") {
      return t("seasonalClimate.increasing");
    }

    if (status === "decreasing") {
      return t("seasonalClimate.decreasing");
    }

    if (status === "normal") {
      return t("seasonalClimate.normal");
    }

    return t("seasonalClimate.notAvailable");
  };

  // ----------------------------------------------------------
  // Metric formatter
  // ----------------------------------------------------------
  const formatMetric = (
    value,
    unit
  ) => {
    if (
      value === null ||
      value === undefined ||
      !Number.isFinite(Number(value))
    ) {
      return t(
        "seasonalClimate.notAvailable"
      );
    }

    return `${value} ${unit}`;
  };

  // ----------------------------------------------------------
  // Metric Card
  // ----------------------------------------------------------
  const MetricCard = ({
    type,
    title,
    current,
    previous,
    comparison,
    unit
  }) => {
    return (
      <div className="sca-metric-card">

        <div className="sca-metric-icon">
          {getMetricIcon(type)}
        </div>

        <div className="sca-metric-content">

          <div className="sca-metric-title">
            {title}
          </div>

          <div className="sca-metric-value">
            {formatMetric(
              current,
              unit
            )}
          </div>

          <div className="sca-metric-previous">
            {t("seasonalClimate.previous")}:{" "}
            {formatMetric(
              previous,
              unit
            )}
          </div>

          <div
            className={`sca-status ${
              comparison?.status || ""
            }`}
          >
            {getStatusIcon(
              comparison?.status
            )}

            <span>
              {comparison?.change !== null &&
              comparison?.change !== undefined
                ? `${comparison.change > 0 ? "+" : ""}${comparison.change}%`
                : ""}{" "}
              {getStatusText(
                comparison?.status
              )}
            </span>
          </div>

        </div>
      </div>
    );
  };

  // ----------------------------------------------------------
  // Period cards
  // ----------------------------------------------------------
  const renderMetricGrid = (
    current,
    previous,
    comparison
  ) => {
    return (
      <div className="sca-metric-grid">

        <MetricCard
          type="temperature"
          title={t(
            "seasonalClimate.temperature"
          )}
          current={current?.temperature}
          previous={previous?.temperature}
          comparison={
            comparison?.temperature
          }
          unit="°C"
        />

        <MetricCard
          type="humidity"
          title={t(
            "seasonalClimate.humidity"
          )}
          current={current?.humidity}
          previous={previous?.humidity}
          comparison={
            comparison?.humidity
          }
          unit="%"
        />

        <MetricCard
          type="rainfall"
          title={t(
            "seasonalClimate.rainfall"
          )}
          current={current?.rainfall}
          previous={previous?.rainfall}
          comparison={
            comparison?.rainfall
          }
          unit="mm"
        />

        <MetricCard
          type="wind"
          title={t(
            "seasonalClimate.windSpeed"
          )}
          current={current?.windSpeed}
          previous={previous?.windSpeed}
          comparison={
            comparison?.windSpeed
          }
          unit="km/h"
        />

      </div>
    );
  };

  // ----------------------------------------------------------
  // Seasonal section
  // ----------------------------------------------------------
  const renderSeasonal = () => {
    if (!analysis) return null;

    const seasons = [
      {
        key: "winter",
        title: t(
          "seasonalClimate.winter"
        )
      },
      {
        key: "summer",
        title: t(
          "seasonalClimate.summer"
        )
      },
      {
        key: "monsoon",
        title: t(
          "seasonalClimate.monsoon"
        )
      },
      {
        key: "postMonsoon",
        title: t(
          "seasonalClimate.postMonsoon"
        )
      }
    ];

    return (
      <div className="sca-season-grid">

        {seasons.map((season) => {
          const data =
            analysis.seasonal[
              season.key
            ];

          if (!data) return null;

          return (
            <div
              className="sca-season-card"
              key={season.key}
            >

              <div className="sca-season-header">
                <CloudSun size={20} />

                <h3>
                  {season.title}
                </h3>
              </div>

              {renderMetricGrid(
                data.current,
                data.previous,
                data.comparison
              )}

            </div>
          );
        })}

      </div>
    );
  };

  // ----------------------------------------------------------
  // Monthly section
  // ----------------------------------------------------------
  const renderMonthly = () => {
    if (!analysis) return null;

    return (
      <div className="sca-table-wrapper">

        <table className="sca-table">

          <thead>
            <tr>
              <th>
                {t(
                  "seasonalClimate.month"
                )}
              </th>

              <th>
                {t(
                  "seasonalClimate.temperature"
                )}
              </th>

              <th>
                {t(
                  "seasonalClimate.humidity"
                )}
              </th>

              <th>
                {t(
                  "seasonalClimate.rainfall"
                )}
              </th>

              <th>
                {t(
                  "seasonalClimate.change"
                )}
              </th>
            </tr>
          </thead>

          <tbody>
            {analysis.monthly.map(
              (item, index) => {

                const hasData =
                  item?.current?.temperature !==
                    null &&
                  item?.current?.temperature !==
                    undefined ||
                  item?.current?.rainfall !==
                    null &&
                  item?.current?.rainfall !==
                    undefined;

                if (!hasData) {
                  return null;
                }

                const monthNumber =
                  getMonthNumber(item);

                return (
                  <tr
                    key={
                      monthNumber ||
                      `month-${index}`
                    }
                  >

                    {/* FIXED MONTH NAME */}
                    <td>
                      {monthNumber
                        ? t(
                            `seasonalClimate.months.${monthNumber}`
                          )
                        : "—"}
                    </td>

                    <td>
                      {formatMetric(
                        item?.current
                          ?.temperature,
                        "°C"
                      )}
                    </td>

                    <td>
                      {formatMetric(
                        item?.current
                          ?.humidity,
                        "%"
                      )}
                    </td>

                    <td>
                      {formatMetric(
                        item?.current
                          ?.rainfall,
                        "mm"
                      )}
                    </td>

                    <td>
                      <span
                        className={`sca-table-status ${
                          item?.comparison
                            ?.temperature
                            ?.status || ""
                        }`}
                      >
                        {item?.comparison
                          ?.temperature
                          ?.change !== null &&
                        item?.comparison
                          ?.temperature
                          ?.change !==
                          undefined
                          ? `${
                              item.comparison
                                .temperature
                                .change > 0
                                ? "+"
                                : ""
                            }${
                              item.comparison
                                .temperature
                                .change
                            }%`
                          : "—"}
                      </span>
                    </td>

                  </tr>
                );
              }
            )}
          </tbody>

        </table>

      </div>
    );
  };

  // ----------------------------------------------------------
  // Quarterly section
  // ----------------------------------------------------------
  const renderQuarterly = () => {
    if (!analysis) return null;

    return (
      <div className="sca-quarter-grid">

        {analysis.quarterly.map(
          (item) => {

            const hasData =
              item.current.temperature !==
                null ||
              item.current.rainfall !==
                null;

            if (!hasData) {
              return null;
            }

            return (
              <div
                className="sca-quarter-card"
                key={item.quarter}
              >

                <div className="sca-quarter-title">
                  {t(
                    `seasonalClimate.quarters.q${item.quarter}`
                  )}
                </div>

                {renderMetricGrid(
                  item.current,
                  item.previous,
                  item.comparison
                )}

              </div>
            );
          }
        )}

      </div>
    );
  };

  // ----------------------------------------------------------
  // Farming advisory
  // ----------------------------------------------------------
  const renderAdvisory = () => {
    if (!analysis) return null;

    const advisory =
      analysis.farmingAdvisory;

    return (
      <div className="sca-advisory">

        <div className="sca-advisory-header">

          <div className="sca-advisory-icon">
            <Sprout size={23} />
          </div>

          <div>
            <h3>
              {t(
                "seasonalClimate.farmingAdvisory"
              )}
            </h3>

            <p>
              {t(
                "seasonalClimate.advisoryBasedOnApi"
              )}
            </p>
          </div>

        </div>

        <div className="sca-advice-list">

          {advisory.advice.map(
            (key) => (
              <div
                className="sca-advice-item"
                key={key}
              >
                <span className="sca-advice-dot">
                  ✓
                </span>

                <span>
                  {t(
                    `seasonalClimate.advice.${key}`
                  )}
                </span>
              </div>
            )
          )}

        </div>

        {advisory.crops.length > 0 && (
          <div className="sca-crop-section">

            <h4>
              {t(
                "seasonalClimate.cropsToConsider"
              )}
            </h4>

            <div className="sca-crop-list">

              {advisory.crops.map(
                (crop) => (
                  <span
                    className="sca-crop-tag"
                    key={crop}
                  >
                    {t(
                      `seasonalClimate.crops.${crop}`,
                      {
                        defaultValue: crop
                      }
                    )}
                  </span>
                )
              )}

            </div>

          </div>
        )}

      </div>
    );
  };

  // ----------------------------------------------------------
  // Loading
  // ----------------------------------------------------------
  if (loading) {
    return (
      <section className="sca-container">

        <div className="sca-main-card sca-loading">

          <RefreshCw
            size={30}
            className="sca-spin"
          />

          <p>
            {t(
              "seasonalClimate.loading"
            )}
          </p>

        </div>

      </section>
    );
  }

  // ----------------------------------------------------------
  // Error
  // ----------------------------------------------------------
  if (error) {
    return (
      <section className="sca-container">

        <div className="sca-main-card sca-error">

          <AlertCircle size={28} />

          <p>{error}</p>

          <button
            onClick={loadAnalysis}
            className="sca-retry-button"
          >
            <RefreshCw size={17} />

            {t(
              "seasonalClimate.retry"
            )}
          </button>

        </div>

      </section>
    );
  }

  if (!analysis) {
    return null;
  }

  // ----------------------------------------------------------
  // Main UI
  // ----------------------------------------------------------
  return (
    <section className="sca-container">

      <div className="sca-main-card">

        {/* HEADER */}
        <div className="sca-header">

          <div className="sca-title-area">

            <div className="sca-title-icon">
              <CloudSun size={28} />
            </div>

            <div>
              <h2>
                {t(
                  "seasonalClimate.title"
                )}
              </h2>

              <p>
                {t(
                  "seasonalClimate.subtitle"
                )}
              </p>
            </div>

          </div>

          <button
            className="sca-refresh"
            onClick={loadAnalysis}
            title={t(
              "seasonalClimate.refresh"
            )}
          >
            <RefreshCw size={18} />
          </button>

        </div>

        {/* LOCATION / PERIOD */}
        <div className="sca-info-bar">

          <span>
            📍 {analysis.location.name}
          </span>

          <span>
            {analysis.years.previous} →{" "}
            {analysis.years.current}
          </span>

        </div>

        {/* VIEW SWITCH */}
        <div className="sca-tabs">

          <button
            className={
              view === "seasonal"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("seasonal")
            }
          >
            {t(
              "seasonalClimate.seasonal"
            )}
          </button>

          <button
            className={
              view === "monthly"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("monthly")
            }
          >
            {t(
              "seasonalClimate.monthly"
            )}
          </button>

          <button
            className={
              view === "quarterly"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("quarterly")
            }
          >
            {t(
              "seasonalClimate.quarterly"
            )}
          </button>

        </div>

        {/* CURRENT YEAR OVERVIEW */}
        <div className="sca-overview">

          <div className="sca-section-heading">

            <div>
              <h3>
                {t(
                  "seasonalClimate.currentPeriod"
                )}
              </h3>

              <p>
                {analysis.dateRange.currentStart}
                {" → "}
                {analysis.dateRange.currentEnd}
              </p>
            </div>

          </div>

          {renderMetricGrid(
            currentPeriod.current,
            currentPeriod.previous,
            currentPeriod.comparison
          )}

        </div>

        {/* SELECTED VIEW */}
        <div className="sca-analysis-section">

          <h3 className="sca-section-title">

            {view === "seasonal" &&
              t(
                "seasonalClimate.seasonalAnalysis"
              )}

            {view === "monthly" &&
              t(
                "seasonalClimate.monthlyAnalysis"
              )}

            {view === "quarterly" &&
              t(
                "seasonalClimate.quarterlyAnalysis"
              )}

          </h3>

          {view === "seasonal" &&
            renderSeasonal()}

          {view === "monthly" &&
            renderMonthly()}

          {view === "quarterly" &&
            renderQuarterly()}

        </div>

        {/* FARMING ADVISORY */}
        {renderAdvisory()}

        {/* SOURCE NOTE */}
        <div className="sca-source-note">

          <CloudSun size={15} />

          <span>
            {t(
              "seasonalClimate.sourceNote"
            )}
          </span>

        </div>

      </div>

    </section>
  );
}