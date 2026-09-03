import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import CropRecommendation from "./pages/CropRecommendation/CropRecommendation";
import FertilizerRecommendation from "./pages/FertilizerRecommendation/FertilizerRecommendation";
import DiseasePrediction from "./pages/DiseasePrediction/DiseasePrediction";
import GovernmentSchemes from "./pages/GovernmentSchemes/GovernmentSchemes";
import YieldPrediction from "./pages/YieldPrediction/YieldPrediction";
import WeatherForecast from "./pages/WeatherForecast/WeatherForecast";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/about" element={<About />} />
      
      <Route path="/crop-recommendation" element={<CropRecommendation />} />

      <Route path="/yield-prediction" element={<YieldPrediction />} />

      <Route path="/fertilizer-recommendation" element={<FertilizerRecommendation />} />

      <Route path="/disease-prediction" element={<DiseasePrediction />} />

      <Route path="/government-schemes" element={<GovernmentSchemes />} />

      <Route path="/weather-forecast" element={<WeatherForecast />} />

    </Routes>
  );
}

export default App;