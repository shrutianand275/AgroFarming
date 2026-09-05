import pickle
import numpy as np
import os


class YieldService:

    def __init__(self):
        self.model = None
        self.encoders = None
        self.load_model()

    # =========================================================
    # LOAD MODEL
    # =========================================================

    def load_model(self):

        try:
            model_path = os.path.join(
                "models",
                "yield_model.pkl"
            )

            encoders_path = os.path.join(
                "models",
                "yield_encoders.pkl"
            )

            if not os.path.exists(model_path):
                raise FileNotFoundError(
                    f"Model file not found: {model_path}"
                )

            if not os.path.exists(encoders_path):
                raise FileNotFoundError(
                    f"Encoder file not found: {encoders_path}"
                )

            with open(model_path, "rb") as f:
                self.model = pickle.load(f)

            with open(encoders_path, "rb") as f:
                self.encoders = pickle.load(f)

            print(
                "✓ Yield prediction model and encoders loaded successfully"
            )

            if hasattr(self.model, "feature_names_in_"):
                print(
                    "✓ Model feature order:",
                    list(self.model.feature_names_in_)
                )

        except Exception as e:

            print(
                "✗ Error loading yield prediction model:",
                str(e)
            )

            raise

    # =========================================================
    # OPTIONS
    # =========================================================

    def get_crops(self):
        return list(
            self.encoders["Crop"].classes_
        )

    def get_seasons(self):
        return list(
            self.encoders["Season"].classes_
        )

    def get_states(self):
        return list(
            self.encoders["State"].classes_
        )

    def get_soil_types(self):
        return list(
            self.encoders["Soil_Type"].classes_
        )

    def get_irrigation_types(self):
        return list(
            self.encoders["Irrigation"].classes_
        )

    # =========================================================
    # ENCODER
    # =========================================================

    def encode_value(self, encoder_name, value):

        if value is None:
            raise ValueError(
                f"{encoder_name} is required."
            )

        value = str(value).strip()

        if not value:
            raise ValueError(
                f"{encoder_name} is required."
            )

        encoder = self.encoders[encoder_name]

        classes = list(
            encoder.classes_
        )

        # Exact match
        if value in classes:
            return int(
                encoder.transform([value])[0]
            )

        # Case-insensitive match
        for item in classes:

            if str(item).strip().lower() == value.lower():

                return int(
                    encoder.transform([item])[0]
                )

        raise ValueError(
            f"Invalid {encoder_name}: '{value}'. "
            f"Available values: {classes}"
        )

    # =========================================================
    # PREDICT YIELD
    # =========================================================

    def predict_yield(self, input_data):

        try:

            # -------------------------------------------------
            # REQUIRED FIELDS
            # -------------------------------------------------

            required_fields = [
                "crop",
                "season",
                "state",
                "area",
                "rainfall",
                "fertilizer",
                "pesticide",
                "temperature",
                "irrigation",
                "soil_type"
            ]

            for field in required_fields:

                if (
                    field not in input_data
                    or input_data[field] is None
                    or str(input_data[field]).strip() == ""
                ):

                    raise ValueError(
                        f"{field} is required."
                    )

            # -------------------------------------------------
            # NUMERIC INPUTS
            # -------------------------------------------------

            try:

                area = float(
                    input_data["area"]
                )

                rainfall = float(
                    input_data["rainfall"]
                )

                fertilizer = float(
                    input_data["fertilizer"]
                )

                pesticide = float(
                    input_data["pesticide"]
                )

                temperature = float(
                    input_data["temperature"]
                )

            except (TypeError, ValueError):

                raise ValueError(
                    "Area, rainfall, fertilizer, pesticide "
                    "and temperature must be valid numbers."
                )

            if area <= 0:
                raise ValueError(
                    "Area must be greater than 0."
                )

            if rainfall < 0:
                raise ValueError(
                    "Rainfall cannot be negative."
                )

            if fertilizer < 0:
                raise ValueError(
                    "Fertilizer cannot be negative."
                )

            if pesticide < 0:
                raise ValueError(
                    "Pesticide cannot be negative."
                )

            # -------------------------------------------------
            # ENCODE CATEGORICAL DATA
            # -------------------------------------------------

            crop_encoded = self.encode_value(
                "Crop",
                input_data["crop"]
            )

            season_encoded = self.encode_value(
                "Season",
                input_data["season"]
            )

            state_encoded = self.encode_value(
                "State",
                input_data["state"]
            )

            irrigation_encoded = self.encode_value(
                "Irrigation",
                input_data["irrigation"]
            )

            soil_encoded = self.encode_value(
                "Soil_Type",
                input_data["soil_type"]
            )

            # -------------------------------------------------
            # IMPORTANT:
            # THESE NAMES MATCH YOUR TRAINED MODEL
            # -------------------------------------------------

            feature_values = {

                "Crop": crop_encoded,

                "Season": season_encoded,

                "State": state_encoded,

                "Area_hectares": area,

                "Annual_Rainfall_mm": rainfall,

                "Fertilizer_kg": fertilizer,

                "Pesticide_kg": pesticide,

                "Temperature_C": temperature,

                "Irrigation": irrigation_encoded,

                "Soil_Type": soil_encoded
            }

            # -------------------------------------------------
            # USE MODEL'S ORIGINAL FEATURE ORDER
            # -------------------------------------------------

            if hasattr(
                self.model,
                "feature_names_in_"
            ):

                feature_order = list(
                    self.model.feature_names_in_
                )

            else:

                feature_order = [
                    "Crop",
                    "Season",
                    "State",
                    "Area_hectares",
                    "Annual_Rainfall_mm",
                    "Fertilizer_kg",
                    "Pesticide_kg",
                    "Temperature_C",
                    "Irrigation",
                    "Soil_Type"
                ]

            # -------------------------------------------------
            # CREATE NUMPY ARRAY
            # -------------------------------------------------

            features = np.array([
                [
                    feature_values[column]
                    for column in feature_order
                ]
            ])

            print(
                "✓ Yield features:",
                features
            )

            # -------------------------------------------------
            # PREDICT
            # -------------------------------------------------

            predicted_yield = float(
                self.model.predict(features)[0]
            )

            # Never return negative yield
            predicted_yield = max(
                predicted_yield,
                0
            )

            # -------------------------------------------------
            # TOTAL PRODUCTION
            # -------------------------------------------------

            total_production = (
                predicted_yield * area
            )

            # -------------------------------------------------
            # CATEGORY
            # -------------------------------------------------

            yield_category = self.categorize_yield(
                predicted_yield,
                input_data["crop"]
            )

            # -------------------------------------------------
            # RECOMMENDATIONS
            # -------------------------------------------------

            recommendations = (
                self.generate_recommendations(
                    input_data,
                    predicted_yield,
                    yield_category
                )
            )

            # -------------------------------------------------
            # FINAL RESULT
            # -------------------------------------------------

            return {

                "predicted_yield": round(
                    predicted_yield,
                    2
                ),

                "total_production": round(
                    total_production,
                    2
                ),

                "yield_category": yield_category,

                "recommendations": recommendations
            }

        except Exception as e:

            print(
                "YIELD SERVICE ERROR:",
                repr(e)
            )

            raise Exception(
                f"Error in yield prediction: {str(e)}"
            )

    # =========================================================
    # YIELD CATEGORY
    # =========================================================

    def categorize_yield(
        self,
        yield_value,
        crop
    ):

        thresholds = {

            "Rice": {
                "low": 3500,
                "medium": 4200,
                "high": 4800
            },

            "Wheat": {
                "low": 3000,
                "medium": 3600,
                "high": 4000
            },

            "Cotton": {
                "low": 2000,
                "medium": 2250,
                "high": 2400
            },

            "Sugarcane": {
                "low": 60000,
                "medium": 67000,
                "high": 70000
            },

            "Maize": {
                "low": 2800,
                "medium": 3300,
                "high": 3600
            },

            "Jute": {
                "low": 2500,
                "medium": 2750,
                "high": 2900
            },

            "Bajra": {
                "low": 1600,
                "medium": 1850,
                "high": 2100
            },

            "Groundnut": {
                "low": 2000,
                "medium": 2250,
                "high": 2500
            },

            "Soybean": {
                "low": 2200,
                "medium": 2450,
                "high": 2700
            },

            "Pulses": {
                "low": 1000,
                "medium": 1150,
                "high": 1300
            }
        }

        crop_thresholds = thresholds.get(
            crop,
            thresholds["Rice"]
        )

        if yield_value < crop_thresholds["low"]:
            return "Low"

        if yield_value < crop_thresholds["medium"]:
            return "Medium"

        if yield_value < crop_thresholds["high"]:
            return "High"

        return "Excellent"

    # =========================================================
    # RECOMMENDATIONS
    # =========================================================

    def generate_recommendations(
        self,
        input_data,
        predicted_yield,
        category
    ):

        recommendations = {
            "en": [],
            "hi": []
        }

        # -------------------------------------------------
        # IRRIGATION
        # -------------------------------------------------

        irrigation = str(
            input_data["irrigation"]
        ).strip().lower()

        if irrigation == "no":

            recommendations["en"].append(
                "Consider drip or sprinkler irrigation "
                "to improve water efficiency."
            )

            recommendations["hi"].append(
                "जल दक्षता बढ़ाने के लिए ड्रिप या "
                "स्प्रिंकलर सिंचाई पर विचार करें।"
            )

        # -------------------------------------------------
        # FERTILIZER
        # -------------------------------------------------

        if float(
            input_data["fertilizer"]
        ) < 100:

            recommendations["en"].append(
                "Consider improving fertilizer application "
                "based on soil requirements."
            )

            recommendations["hi"].append(
                "मिट्टी की आवश्यकता के अनुसार "
                "उर्वरक का उपयोग सुधारें।"
            )

        # -------------------------------------------------
        # RAINFALL
        # -------------------------------------------------

        if float(
            input_data["rainfall"]
        ) < 800:

            recommendations["en"].append(
                "Consider water conservation and "
                "rainwater harvesting."
            )

            recommendations["hi"].append(
                "जल संरक्षण और वर्षा जल संचयन पर विचार करें।"
            )

        # -------------------------------------------------
        # LOW
        # -------------------------------------------------

        if category == "Low":

            recommendations["en"].append(
                "Consider soil testing and improved "
                "crop management."
            )

            recommendations["hi"].append(
                "मिट्टी परीक्षण और बेहतर फसल प्रबंधन पर विचार करें।"
            )

            recommendations["en"].append(
                "Consider crop rotation to improve soil health."
            )

            recommendations["hi"].append(
                "मिट्टी की सेहत सुधारने के लिए फसल चक्र अपनाएं।"
            )

        # -------------------------------------------------
        # MEDIUM
        # -------------------------------------------------

        elif category == "Medium":

            recommendations["en"].append(
                "Apply balanced nutrients and organic "
                "fertilizers where appropriate."
            )

            recommendations["hi"].append(
                "उचित मात्रा में संतुलित पोषक तत्व और "
                "जैविक उर्वरक का उपयोग करें।"
            )

        # -------------------------------------------------
        # HIGH / EXCELLENT
        # -------------------------------------------------

        elif category in [
            "High",
            "Excellent"
        ]:

            recommendations["en"].append(
                "Maintain current farming practices "
                "for consistent results."
            )

            recommendations["hi"].append(
                "लगातार अच्छे परिणामों के लिए "
                "वर्तमान कृषि पद्धतियों को बनाए रखें।"
            )

        # -------------------------------------------------
        # DEFAULT
        # -------------------------------------------------

        if not recommendations["en"]:

            recommendations["en"].append(
                "Follow recommended agricultural practices "
                "for your region."
            )

            recommendations["hi"].append(
                "अपने क्षेत्र के लिए अनुशंसित कृषि पद्धतियों "
                "का पालन करें।"
            )

        return recommendations


# =========================================================
# SINGLETON
# =========================================================

yield_service = YieldService()