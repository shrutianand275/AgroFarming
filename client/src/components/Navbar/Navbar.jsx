import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand navbar-light bg-white shadow-sm">
      <div className="container">

        {/* Logo */}
        <a className="navbar-brand fw-bold text-success" href="/">
          🌿 AgroFarming
        </a>

        {/* Menu */}
        <ul className="navbar-nav ms-auto align-items-center">

          <li className="nav-item">
            <a className="nav-link active" href="#">
              Home
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#">
              About
            </a>
          </li>

          <li className="nav-item dropdown">

            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              AI Services
            </a>

            <ul className="dropdown-menu">

              <li>
                <a className="dropdown-item" href="#">
                  Crop Recommendation
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  Yield Prediction
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  Disease Prediction
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  Fertilizer Recommendation
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  Weather Forecast
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  AI Chatbot
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="#">
                  Government Schemes
                </a>
              </li>

            </ul>

          </li>

          <li className="nav-item ms-3 d-flex align-items-center">
            <span className="me-2 fw-semibold">EN</span>

            <div className="form-check form-switch m-0">
              <input
                className="form-check-input"
                type="checkbox"
                id="languageSwitch"
              />
            </div>

            <span className="ms-2 fw-semibold">हिंदी</span>
          </li>


          <li className="nav-item ms-3">
            <button className="btn btn-success px-4">
              Login
            </button>
          </li>

        </ul>

      </div>
    </nav>
  );
}

export default Navbar;