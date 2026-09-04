import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import CropRecommendation from "./pages/CropRecommendation/CropRecommendation";
import FertilizerRecommendation from "./pages/FertilizerRecommendation/FertilizerRecommendation";
import DiseasePrediction from "./pages/DiseasePrediction/DiseasePrediction";
import GovernmentSchemes from "./pages/GovernmentSchemes/GovernmentSchemes";
import YieldPrediction from "./pages/YieldPrediction/YieldPrediction";
import WeatherForecast from "./pages/WeatherForecast/WeatherForecast";
import Chatbot from "./pages/Chatbot/Chatbot";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import History from "./pages/History/History";
import Notifications from "./pages/Notifications/Notifications";

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

      <Route path="/chatbot" element={<Chatbot />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/history" element={<History />} />

      <Route path="/notifications" element={<Notifications />} />

    </Routes>
  );
}

export default App;