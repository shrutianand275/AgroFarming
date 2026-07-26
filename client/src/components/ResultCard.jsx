import React from "react";
import {
  FaLeaf,
  FaChartLine,
  FaCalendarAlt,
  FaLightbulb,
  FaAward
} from "react-icons/fa";

const ResultCard = ({ result }) => {

  if (!result) return null;

  return (

    <div className="card shadow-lg border-0 mt-5">

      <div className="card-header bg-success text-white">

        <h3 className="mb-0">

          🌾 Crop Recommendation Result

        </h3>

      </div>

      <div className="card-body">

        <div className="row">

          <div className="col-md-6 mb-4">

            <div className="p-3 bg-light rounded">

              <h5>

                <FaLeaf className="me-2 text-success" />

                Recommended Crop

              </h5>

              <h2 className="text-success fw-bold">

                {result.recommended_crop}

              </h2>

            </div>

          </div>

          <div className="col-md-6 mb-4">

            <div className="p-3 bg-light rounded">

              <h5>

                <FaChartLine className="me-2 text-primary" />

                Confidence

              </h5>

              <h2 className="text-primary fw-bold">

                {result.confidence}%

              </h2>

            </div>

          </div>

        </div>

        <div className="row">

          <div className="col-md-6 mb-4">

            <div className="p-3 border rounded">

              <h5>

                <FaCalendarAlt className="me-2 text-warning" />

                Suitable Season

              </h5>

              <h4>

                {result.season}

              </h4>

            </div>

          </div>

          <div className="col-md-6 mb-4">

            <div className="p-3 border rounded">

              <h5>

                <FaLightbulb className="me-2 text-info" />

                Farming Tip

              </h5>

              <p className="mb-0">

                {result.tips}

              </p>

            </div>

          </div>

        </div>

        <hr />

        <h4 className="mb-3">

          <FaAward className="me-2 text-success" />

          Top 3 Crop Recommendations

        </h4>

        <table className="table table-striped">

          <thead>

            <tr>

              <th>#</th>

              <th>Crop</th>

              <th>Confidence</th>

            </tr>

          </thead>

          <tbody>

            {result.top3.map((crop, index) => (

              <tr key={index}>

                <td>{index + 1}</td>

                <td>{crop.crop}</td>

                <td>{crop.confidence}%</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default ResultCard;