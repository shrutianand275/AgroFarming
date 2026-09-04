import "./Navbar.css";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../../services/api";

function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("agroToken")
  );

  const toggleLanguage = () => {
    i18n.changeLanguage(
      i18n.language === "en" ? "hi" : "en"
    );
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logoutUser();

    setIsLoggedIn(false);

    navigate("/");

    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white shadow-sm">
      <div className="container">

        {/* ==============================
            LOGO
        ============================== */}

        <Link
          className="navbar-brand fw-bold text-success"
          to="/"
        >
          🌿 {t("logo")}
        </Link>


        {/* ==============================
            MENU
        ============================== */}

        <ul className="navbar-nav ms-auto align-items-center">

          {/* HOME */}

          <li className="nav-item">
            <Link className="nav-link" to="/">
              {t("home")}
            </Link>
          </li>


          {/* ABOUT */}

          <li className="nav-item">
            <Link className="nav-link" to="/about">
              {t("aboutMenu")}
            </Link>
          </li>


          {/* ==============================
              AI SERVICES
          ============================== */}

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
                <Link
                  className="dropdown-item"
                  to="/crop-recommendation"
                >
                  {t("cropRecommendation")}
                </Link>
              </li>

              <li>
                <Link
                  className="dropdown-item"
                  to="/yield-prediction"
                >
                  {t("yieldPrediction")}
                </Link>
              </li>

              <li>
                <Link
                  className="dropdown-item"
                  to="/disease-prediction"
                >
                  {t("diseasePrediction")}
                </Link>
              </li>

              <li>
                <Link
                  className="dropdown-item"
                  to="/fertilizer-recommendation"
                >
                  {t("fertilizerRecommendation")}
                </Link>
              </li>

              <li>
                <Link
                  className="dropdown-item"
                  to="/weather-forecast"
                >
                  {t("weatherForecast")}
                </Link>
              </li>

              <li>
                <Link
                  className="dropdown-item"
                  to="/chatbot"
                >
                  {t("chatbot.name")}
                </Link>
              </li>

              <li>
                <Link
                  className="dropdown-item"
                  to="/government-schemes"
                >
                  {t("governmentSchemes")}
                </Link>
              </li>

            </ul>

          </li>


          {/* ==============================
              LANGUAGE
          ============================== */}

          <li className="nav-item language-switch">

            <span className="lang-text">
              EN
            </span>

            <div className="form-check form-switch m-0">

              <input
                className="form-check-input"
                type="checkbox"
                checked={i18n.language === "hi"}
                onChange={toggleLanguage}
              />

            </div>

            <span className="lang-text">
              हिंदी
            </span>

          </li>


          {/* ==============================
              GUEST USER
          ============================== */}

          {!isLoggedIn && (
            <>

              <li className="nav-item ms-2">

                <Link
                  to="/login"
                  className="btn btn-outline-success px-3"
                >
                  Login
                </Link>

              </li>

              <li className="nav-item ms-2">

                <Link
                  to="/signup"
                  className="btn btn-success px-3"
                >
                  Register
                </Link>

              </li>

            </>
          )}


          {/* ==============================
              LOGGED-IN USER
          ============================== */}

          {isLoggedIn && (
            <>

              {/* Profile */}

              <li className="nav-item ms-2">

                <Link
                  to="/profile"
                  className="nav-link fw-semibold"
                >
                   Profile
                </Link>

              </li>


              {/* History */}

              <li className="nav-item">

                <Link
                  to="/history"
                  className="nav-link fw-semibold"
                >
                 History
                </Link>

              </li>


              {/* Notifications */}

              <li className="nav-item">

                <Link
                  to="/notifications"
                  className="nav-link notification-link"
                  title="Notifications"
                >
                  🔔
                </Link>

              </li>


              {/* Logout */}

              <li className="nav-item ms-2">

                <button
                  type="button"
                  className="btn btn-outline-danger px-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </li>

            </>
          )}

        </ul>

      </div>
    </nav>
  );
}

export default Navbar;