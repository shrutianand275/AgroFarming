import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ClimateForm from "../../components/ClimateForm";
import ResultCard from "../../components/ResultCard";

import { recommendCrop } from "../../services/api";

import "./CropRecommendation.css";

const CropRecommendation = () => {

    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleRecommendation = async (formData) => {

        setLoading(true);
        setResult(null);
        setError("");

        try {

            const response = await recommendCrop({

                N: Number(formData.N),
                P: Number(formData.P),
                K: Number(formData.K),
                temperature: Number(formData.temperature),
                humidity: Number(formData.humidity),
                ph: Number(formData.ph),
                rainfall: Number(formData.rainfall)

            });

            if (response.success) {

                setResult(response.data);

            } else {

                setError(response.message);

            }

        } catch (err) {

            console.error(err);

            setError(t("crop.serverError"));

        }

        setLoading(false);

    };

    return (

        <>

            <Navbar />

            <section className="crop-page">

                <div className="container crop-container">

                    {/* Heading */}

                    <div className="text-center crop-header">

                        <span className="crop-badge">

                            🌾 {t("crop.aiPowered")}

                        </span>

                        <h1 className="crop-title">

                            {t("crop.title")}

                        </h1>

                        <p className="crop-subtitle">

                            {t("crop.subtitle")}

                        </p>

                    </div>

                    {/* Information */}

                    <div className="alert alert-success crop-alert">

                        <strong>

                            {t("crop.noteTitle")}

                        </strong>

                        <br />

                        {t("crop.note")}

                    </div>

                    {/* Form */}

                    <div className="card crop-card shadow-sm border-0">

                        <div className="card-body crop-card-body">

                            <ClimateForm
                                onSubmit={handleRecommendation}
                            />

                        </div>

                    </div>

                    {/* Loading */}

                    {

                        loading && (

                            <div className="text-center crop-loading">

                                <div

                                    className="spinner-border text-success"

                                    role="status"

                                />

                                <h6 className="mt-2">

                                    {t("crop.predicting")}

                                </h6>

                            </div>

                        )

                    }

                    {/* Error */}

                    {

                        error && (

                            <div className="alert alert-danger mt-3">

                                {error}

                            </div>

                        )

                    }

                    {/* Result */}

                    {

                        result && (

                            <ResultCard

                                result={result}

                            />

                        )

                    }

                </div>

            </section>

            <Footer />

        </>

    );

};

export default CropRecommendation;