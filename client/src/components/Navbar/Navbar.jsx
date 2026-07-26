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
                <a className="dropdown-item" href="#">
                  {t("cropRecommendation")}
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  {t("yieldPrediction")}
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  {t("diseasePrediction")}
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  {t("fertilizerRecommendation")}
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  {t("weatherForecast")}
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  {t("chatbot")}
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  {t("governmentSchemes")}
                </a>
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