import "./Navbar.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Navbar() {

  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white shadow-sm">
      <div className="container">

        {/* Logo */}
        <a className="navbar-brand fw-bold text-success" href="/">
          🌿 {t("logo")}
        </a>

        {/* Menu */}
        <ul className="navbar-nav ms-auto align-items-center">

          <li>
            <Link className="nav-link" to="/">
              {t("home")}
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/about">
              {t("aboutMenu")}
            </Link>
          </li>

          <li className="nav-item dropdown">

            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              {t("aiServices")}
            </a>

            <ul className="dropdown-menu">

              <li>
                <Link className="dropdown-item" to="/crop-recommendation">
                  {t("cropRecommendation")}
                </Link>
              </li>

              <li>
                <Link className="dropdown-item" to="/yield-prediction">
                  {t("yieldPrediction")}
                </Link>
              </li>

              <li>
                <Link className="dropdown-item" to="/disease-prediction">
                  {t("diseasePrediction")}
                </Link>
              </li>

              <li>
                <Link className="dropdown-item" to="/fertilizer-recommendation">
                  {t("fertilizerRecommendation")}
                </Link>
              </li>

              <li>
                <Link className="dropdown-item" to="/weather-forecast">
                  {t("weatherForecast")}
                </Link>
              </li>

              <li>
                <Link className="dropdown-item" to="/chatbot">
                  {t("chatbot")}
                </Link>
              </li>

              <li>
                <Link className="dropdown-item" to="/government-schemes">
                  {t("governmentSchemes")}
                </Link>
              </li>

            </ul>

          </li>

          {/* Language Switch */}

          <li className="nav-item language-switch">

            <span className="lang-text">EN</span>

            <div className="form-check form-switch m-0">

              <input
                className="form-check-input"
                type="checkbox"
                checked={i18n.language === "hi"}
                onChange={toggleLanguage}
              />

            </div>

            <span className="lang-text">हिंदी</span>

          </li>

          {/* Login */}

          <li className="nav-item ms-3">
            <button className="btn btn-success px-4">
              {t("login")}
            </button>
          </li>

        </ul>

      </div>
    </nav>
  );
}

export default Navbar;