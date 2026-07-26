import React from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./About.css";

import {
  FaSeedling,
  FaRobot,
  FaLeaf,
  FaCloudSunRain,
  FaFlask,
  FaChartLine,
  FaCheckCircle,
  FaGlobeAsia,
  FaCode,
  FaBullseye,
} from "react-icons/fa";

const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />

      <section className="about-page">

        {/* Header */}
        <div className="container">
          <div className="about-header text-center">
            <span className="about-tag">
              <FaSeedling /> {t("about.tag")}
            </span>

            <h2>{t("about.title")}</h2>

            <p>{t("about.subtitle")}</p>
          </div>
        </div>

        {/* About */}
        <div className="container about-section">
          <div className="row align-items-center">

            <div className="col-lg-6">
              <h3>{t("about.heading")}</h3>

              <p>{t("about.description1")}</p>

              <p>{t("about.description2")}</p>
            </div>

            <div className="col-lg-6">

              <div className="about-highlight">

                <div className="highlight-item">
                  <FaRobot />
                  <div>
                    <h5>{t("about.aiTitle")}</h5>
                    <p>{t("about.aiDesc")}</p>
                  </div>
                </div>

                <div className="highlight-item">
                  <FaLeaf />
                  <div>
                    <h5>{t("about.greenTitle")}</h5>
                    <p>{t("about.greenDesc")}</p>
                  </div>
                </div>

                <div className="highlight-item">
                  <FaGlobeAsia />
                  <div>
                    <h5>{t("about.multiTitle")}</h5>
                    <p>{t("about.multiDesc")}</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Mission */}

        <div className="mission-section">

          <div className="container">

            <div className="section-title">

              <h2>{t("about.missionTitle")}</h2>

              <p>{t("about.missionSubtitle")}</p>

            </div>

            <div className="mission-grid">

              <div>

                <FaSeedling className="mission-icon" />

                <h4>{t("about.mission1")}</h4>

                <p>{t("about.mission1Desc")}</p>

              </div>

              <div>

                <FaRobot className="mission-icon" />

                <h4>{t("about.mission2")}</h4>

                <p>{t("about.mission2Desc")}</p>

              </div>

              <div>

                <FaBullseye className="mission-icon" />

                <h4>{t("about.mission3")}</h4>

                <p>{t("about.mission3Desc")}</p>

              </div>

            </div>

          </div>

        </div>

        {/* What We Offer */}

        <div className="container offer-section">

          <div className="section-title">

            <h2>{t("about.offerTitle")}</h2>

            <p>{t("about.offerSubtitle")}</p>

          </div>

          <div className="offer-list">

            <div>
              <FaSeedling />
              <span>{t("about.offer1")}</span>
            </div>

            <div>
              <FaChartLine />
              <span>{t("about.offer2")}</span>
            </div>

            <div>
              <FaLeaf />
              <span>{t("about.offer3")}</span>
            </div>

            <div>
              <FaFlask />
              <span>{t("about.offer4")}</span>
            </div>

            <div>
              <FaCloudSunRain />
              <span>{t("about.offer5")}</span>
            </div>

            <div>
              <FaRobot />
              <span>{t("about.offer6")}</span>
            </div>

          </div>

        </div>

        {/* Why Choose */}

        <div className="why-section">

          <div className="container">

            <div className="section-title">

              <h2>{t("about.whyTitle")}</h2>

            </div>

            <div className="why-grid">

              <div><FaCheckCircle /> {t("about.why1")}</div>

              <div><FaCheckCircle /> {t("about.why2")}</div>

              <div><FaCheckCircle /> {t("about.why3")}</div>

              <div><FaCheckCircle /> {t("about.why4")}</div>

              <div><FaCheckCircle /> {t("about.why5")}</div>

              <div><FaCheckCircle /> {t("about.why6")}</div>

            </div>

          </div>

        </div>

        {/* Technology */}

        <div className="container tech-section">

          <div className="section-title">

            <h2>{t("about.techTitle")}</h2>

          </div>

          <div className="tech-stack">

            <span><FaCode /> React</span>

            <span><FaCode /> Node.js</span>

            <span><FaCode /> Express</span>

            <span><FaCode /> MongoDB</span>

            <span><FaCode /> Python</span>

            <span><FaCode /> Machine Learning</span>

          </div>

        </div>


      </section>

      <Footer />
    </>
  );
};

export default About;