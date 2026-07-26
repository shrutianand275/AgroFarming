import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaSeedling,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-content">

          {/* Left */}
          <div className="footer-left">

            <h3>
              <FaSeedling className="footer-logo" />
              AgroFarming
            </h3>

            <p>
              AI-powered Smart Farming for better crop decisions,
              higher productivity and sustainable agriculture.
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
          © 2026 AgroFarming • Smart Farming System
        </div>

      </div>

    </footer>
  );
}

export default Footer;