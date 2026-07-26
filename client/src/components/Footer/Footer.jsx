import React from "react";
import "./Footer.css";
import { useTranslation } from "react-i18next";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaSeedling,
} from "react-icons/fa";

function Footer() {

  const { t } = useTranslation();

  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-content">

          {/* Left */}

          <div className="footer-left">

            <h3>
              <FaSeedling className="footer-logo" />
              {t("footer.logo")}
            </h3>

            <p>
              {t("footer.description")}
            </p>

          </div>

          {/* Right */}

          <div className="footer-right">

            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaLinkedinIn />
            </a>

          </div>

        </div>

        <hr />

        <div className="copyright">
          {t("footer.copyright")}
        </div>

      </div>

    </footer>
  );
}

export default Footer;