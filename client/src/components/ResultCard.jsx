import React from "react";
import {
  FaLeaf,
  FaChartLine,
  FaCalendarAlt,
  FaLightbulb,
  FaAward
} from "react-icons/fa";

import "./ResultCard.css";

const ResultCard = ({ result }) => {
  if (!result) return null;

  return (
    <div className="result-card">

      {/* Header */}
      <div className="result-header">
        <h3>
          🌾 Crop Recommendation Result
        </h3>
      </div>

      <div className="result-content">

        {/* Left Section */}
        <div className="result-left">

          <div className="result-item">
            <div className="result-label">
              <FaLeaf />
              <span>Recommended Crop</span>
            </div>

            <div className="recommended-crop">
              {result.recommended_crop}
            </div>
          </div>


          <div className="result-item">
            <div className="result-label">
              <FaChartLine />
              <span>Confidence</span>
            </div>

            <div className="confidence-value">
              {result.confidence}%
            </div>
          </div>


          <div className="result-item">
            <div className="result-label">
              <FaCalendarAlt />
              <span>Suitable Season</span>
            </div>

            <p>
              {result.season}
            </p>
          </div>


          <div className="result-item">
            <div className="result-label">
              <FaLightbulb />
              <span>Farming Tip</span>
            </div>

            <p>
              {result.tips}
            </p>
          </div>

        </div>


        {/* Right Section */}
        <div className="result-right">

          <div className="top-crops-title">
            <FaAward />
            <span>Top 3 Crop Recommendations</span>
          </div>

          <table className="crop-result-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Crop</th>
                <th>Confidence</th>
              </tr>
            </thead>

            <tbody>

              {result.top3?.map((crop, index) => (
                <tr key={index}>

                  <td>
                    {index + 1}
                  </td>

                  <td className="crop-name">
                    {crop.crop}
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