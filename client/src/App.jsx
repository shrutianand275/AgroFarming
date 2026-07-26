import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import CropRecommendation from "./pages/CropRecommendation/CropRecommendation";
function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/about" element={<About />} />
      
      <Route path="/crop-recommendation"element={<CropRecommendation />}/>

    </Routes>
  );
}

export default App;