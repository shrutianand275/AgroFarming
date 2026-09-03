import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar/Navbar";
import "./GovernmentSchemes.css";

// Import schemes data
import schemesData from "../../data/governmentSchemes";

const GovernmentSchemes = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Financial Support",
    "Credit",
    "Insurance",
    "Subsidy",
    "Technical Support",
    "Marketing",
    "Digital Service"
  ];

  const filteredSchemes = schemesData.filter((scheme) => {
    const matchesSearch = 
      scheme.Scheme_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i18n.language === 'hi' ? scheme.Description_HI : scheme.Description_EN)
        .toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "All" || scheme.Category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      <section className="schemes-page">
        <div className="container schemes-container">
          {/* Header */}
          <div className="text-center schemes-header">
            <h6 className="schemes-title">
              {t("schemes.title")}
            </h6>
          </div>

          {/* Search and Filter */}
          <div className="schemes-controls">
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder={t("schemes.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Schemes Grid */}
          <div className="schemes-grid">
            {filteredSchemes.map((scheme, index) => (
              <div key={index} className="scheme-card">
                <div className="scheme-header">
                  <h5 className="scheme-name">{scheme.Scheme_Name}</h5>
                  <span className="scheme-category">{scheme.Category}</span>
                </div>

                <div className="scheme-body">
                  <p className="scheme-description">
                    {i18n.language === 'hi' ? scheme.Description_HI : scheme.Description_EN}
                  </p>

                  <div className="scheme-details">
                    <div className="detail-item">
                      <strong>💰 {t("schemes.benefits")}:</strong>
                      <p>{i18n.language === 'hi' ? scheme.Benefits_HI : scheme.Benefits_EN}</p>
                    </div>

                    <div className="detail-item">
                      <strong>✅ {t("schemes.eligibility")}:</strong>
                      <p>{i18n.language === 'hi' ? scheme.Eligibility_HI : scheme.Eligibility_EN}</p>
                    </div>

                    <div className="detail-item">
                      <strong>📝 {t("schemes.howToApply")}:</strong>
                      <p>{i18n.language === 'hi' ? scheme.How_To_Apply_HI : scheme.How_To_Apply_EN}</p>
                    </div>

                    <div className="scheme-meta">
                      <span>🏛️ {scheme.Ministry}</span>
                      <span>📅 {scheme.Launch_Year}</span>
                    </div>
                  </div>
                </div>

                {scheme.Official_Website && (
                  <div className="scheme-footer">
                    <a
                      href={scheme.Official_Website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apply-link"
                    >
                      {t("schemes.visitWebsite")} →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredSchemes.length === 0 && (
            <div className="no-results">
              <p>{t("schemes.noResults")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default GovernmentSchemes;
