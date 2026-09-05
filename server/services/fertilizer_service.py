import pickle
import os
import numpy as np

# Load models and encoders
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

try:
    with open(os.path.join(MODEL_DIR, 'fertilizer_model.pkl'), 'rb') as f:
        fertilizer_model = pickle.load(f)
    
    with open(os.path.join(MODEL_DIR, 'fertilizer_scaler.pkl'), 'rb') as f:
        fertilizer_scaler = pickle.load(f)
    
    with open(os.path.join(MODEL_DIR, 'fertilizer_label_encoder.pkl'), 'rb') as f:
        fertilizer_label_encoder = pickle.load(f)
    
    with open(os.path.join(MODEL_DIR, 'soil_type_encoder.pkl'), 'rb') as f:
        soil_type_encoder = pickle.load(f)
    
    with open(os.path.join(MODEL_DIR, 'crop_type_encoder.pkl'), 'rb') as f:
        crop_type_encoder = pickle.load(f)
    
    print("✅ Fertilizer models loaded successfully!")
    print("Fertilizer Crop classes:", crop_type_encoder.classes_)
    print("Fertilizer Soil classes:", soil_type_encoder.classes_)
    print("Fertilizer labels:", fertilizer_label_encoder.classes_)

except Exception as e:
    print(f"⚠️ Warning: Fertilizer models not loaded - {str(e)}")
    fertilizer_model = None

# Fertilizer information database (bilingual)
FERTILIZER_INFO = {
    "Urea": {
        "description_en": "Urea is a high nitrogen fertilizer (46% N) that is widely used for crop nutrition. It is water-soluble and quickly absorbed by plants.",
        "description_hi": "यूरिया एक उच्च नाइट्रोजन उर्वरक (46% N) है जो फसल पोषण के लिए व्यापक रूप से उपयोग किया जाता है। यह पानी में घुलनशील है और पौधों द्वारा जल्दी अवशोषित होता है।",
        "benefits_en": [
            "Promotes rapid green growth and leaf development",
            "Increases protein content in crops",
            "Cost-effective nitrogen source",
            "Suitable for all soil types"
        ],
        "benefits_hi": [
            "तेजी से हरी वृद्धि और पत्ती विकास को बढ़ावा देता है",
            "फसलों में प्रोटीन सामग्री बढ़ाता है",
            "लागत प्रभावी नाइट्रोजन स्रोत",
            "सभी मिट्टी के प्रकारों के लिए उपयुक्त"
        ],
        "tips_en": [
            "Apply 2-3 times during crop growth season",
            "Apply when soil moisture is adequate",
            "Mix with soil to prevent nitrogen loss",
            "Avoid over-application to prevent lodging"
        ],
        "tips_hi": [
            "फसल वृद्धि के मौसम में 2-3 बार लगाएं",
            "मिट्टी की नमी पर्याप्त होने पर लगाएं",
            "नाइट्रोजन हानि को रोकने के लिए मिट्टी के साथ मिलाएं",
            "गिरने से बचने के लिए अधिक प्रयोग से बचें"
        ]
    },
    "DAP": {
        "description_en": "Di-Ammonium Phosphate (DAP) is a phosphorus-rich fertilizer (18% N, 46% P₂O₅) ideal for root development and early plant growth.",
        "description_hi": "डाई-अमोनियम फॉस्फेट (DAP) एक फॉस्फोरस युक्त उर्वरक (18% N, 46% P₂O₅) है जो जड़ विकास और प्रारंभिक पौधे की वृद्धि के लिए आदर्श है।",
        "benefits_en": [
            "Promotes strong root development",
            "Enhances flowering and fruiting",
            "Provides both nitrogen and phosphorus",
            "Improves crop quality and yield"
        ],
        "benefits_hi": [
            "मजबूत जड़ विकास को बढ़ावा देता है",
            "फूलों और फलों को बढ़ाता है",
            "नाइट्रोजन और फॉस्फोरस दोनों प्रदान करता है",
            "फसल की गुणवत्ता और उपज में सुधार करता है"
        ],
        "tips_en": [
            "Apply as basal dose during sowing/planting",
            "Place near seed zone for better uptake",
            "Works best in neutral to alkaline soils",
            "Can be mixed with urea for balanced nutrition"
        ],
        "tips_hi": [
            "बुवाई/रोपण के दौरान बेसल खुराक के रूप में लगाएं",
            "बेहतर अवशोषण के लिए बीज क्षेत्र के पास रखें",
            "तटस्थ से क्षारीय मिट्टी में सबसे अच्छा काम करता है",
            "संतुलित पोषण के लिए यूरिया के साथ मिलाया जा सकता है"
        ]
    },
    "MOP": {
        "description_en": "Muriate of Potash (MOP) is a potassium chloride fertilizer (60% K₂O) essential for overall plant health and disease resistance.",
        "description_hi": "म्यूरिएट ऑफ पोटाश (MOP) एक पोटेशियम क्लोराइड उर्वरक (60% K₂O) है जो समग्र पौधे के स्वास्थ्य और रोग प्रतिरोध के लिए आवश्यक है।",
        "benefits_en": [
            "Improves water use efficiency",
            "Enhances disease and pest resistance",
            "Increases crop quality and shelf life",
            "Strengthens stems and prevents lodging"
        ],
        "benefits_hi": [
            "पानी के उपयोग की दक्षता में सुधार करता है",
            "रोग और कीट प्रतिरोध बढ़ाता है",
            "फसल की गुणवत्ता और शेल्फ लाइफ बढ़ाता है",
            "तने को मजबूत करता है और गिरने से बचाता है"
        ],
        "tips_en": [
            "Apply in 2-3 split doses during growth stages",
            "Mix with soil before irrigation",
            "Essential during fruit development stage",
            "Avoid using on chloride-sensitive crops"
        ],
        "tips_hi": [
            "विकास चरणों के दौरान 2-3 विभाजित खुराकों में लगाएं",
            "सिंचाई से पहले मिट्टी के साथ मिलाएं",
            "फल विकास चरण के दौरान आवश्यक",
            "क्लोराइड संवेदनशील फसलों पर उपयोग से बचें"
        ]
    },
    "14-35-14": {
        "description_en": "NPK 14-35-14 is a balanced fertilizer with high phosphorus content, ideal for flowering and fruiting crops.",
        "description_hi": "NPK 14-35-14 एक संतुलित उर्वरक है जिसमें उच्च फॉस्फोरस सामग्री है, जो फूलने और फल देने वाली फसलों के लिए आदर्श है।",
        "benefits_en": [
            "Balanced nutrition for all growth stages",
            "Enhances flowering and fruit setting",
            "Improves crop quality and marketability",
            "Suitable for a wide range of crops"
        ],
        "benefits_hi": [
            "सभी विकास चरणों के लिए संतुलित पोषण",
            "फूल और फल सेटिंग को बढ़ाता है",
            "फसल की गुणवत्ता और विपणन क्षमता में सुधार करता है",
            "विभिन्न फसलों के लिए उपयुक्त"
        ],
        "tips_en": [
            "Apply at planting and during flowering stage",
            "Can be used for drip irrigation",
            "Suitable for foliar application when diluted",
            "Provides complete nutrition in single application"
        ],
        "tips_hi": [
            "रोपण और फूलने के चरण में लगाएं",
            "ड्रिप सिंचाई के लिए उपयोग किया जा सकता है",
            "पतला करने पर पर्णीय अनुप्रयोग के लिए उपयुक्त",
            "एकल अनुप्रयोग में पूर्ण पोषण प्रदान करता है"
        ]
    },
    "28-28": {
        "description_en": "NPK 28-28 is a balanced nitrogen and phosphorus fertilizer suitable for crops requiring equal N and P nutrition.",
        "description_hi": "NPK 28-28 एक संतुलित नाइट्रोजन और फॉस्फोरस उर्वरक है जो समान N और P पोषण की आवश्यकता वाली फसलों के लिए उपयुक्त है।",
        "benefits_en": [
            "Provides balanced N and P nutrition",
            "Promotes vegetative growth and root development",
            "Improves soil fertility",
            "Suitable for cereal crops"
        ],
        "benefits_hi": [
            "संतुलित N और P पोषण प्रदान करता है",
            "वनस्पति वृद्धि और जड़ विकास को बढ़ावा देता है",
            "मिट्टी की उर्वरता में सुधार करता है",
            "अनाज की फसलों के लिए उपयुक्त"
        ],
        "tips_en": [
            "Apply as basal dose before sowing",
            "Suitable for broadcast application",
            "Mix thoroughly with soil",
            "Can be supplemented with potassium if needed"
        ],
        "tips_hi": [
            "बुवाई से पहले बेसल खुराक के रूप में लगाएं",
            "प्रसारण अनुप्रयोग के लिए उपयुक्त",
            "मिट्टी के साथ अच्छी तरह से मिलाएं",
            "आवश्यकता होने पर पोटेशियम के साथ पूरक किया जा सकता है"
        ]
    },
    "TSP": {
        "description_en": "Triple Super Phosphate (TSP) is a concentrated phosphate fertilizer (46% P₂O₅) for rapid phosphorus supply.",
        "description_hi": "ट्रिपल सुपर फॉस्फेट (TSP) एक केंद्रित फॉस्फेट उर्वरक (46% P₂O₅) है जो तेजी से फॉस्फोरस आपूर्ति के लिए है।",
        "benefits_en": [
            "High phosphorus concentration",
            "Enhances root growth and establishment",
            "Improves flowering and seed formation",
            "Long-lasting phosphorus source"
        ],
        "benefits_hi": [
            "उच्च फॉस्फोरस सांद्रता",
            "जड़ वृद्धि और स्थापना को बढ़ाता है",
            "फूल और बीज निर्माण में सुधार करता है",
            "लंबे समय तक चलने वाला फॉस्फोरस स्रोत"
        ],
        "tips_en": [
            "Apply before planting or during land preparation",
            "Place in root zone for better absorption",
            "Suitable for phosphorus-deficient soils",
            "Combine with nitrogen sources for balanced nutrition"
        ],
        "tips_hi": [
            "रोपण से पहले या भूमि तैयारी के दौरान लगाएं",
            "बेहतर अवशोषण के लिए जड़ क्षेत्र में रखें",
            "फॉस्फोरस की कमी वाली मिट्टी के लिए उपयुक्त",
            "संतुलित पोषण के लिए नाइट्रोजन स्रोतों के साथ मिलाएं"
        ]
    },
    "20-20": {
        "description_en": "NPK 20-20 is a balanced fertilizer providing equal nitrogen and phosphorus for early crop growth stages.",
        "description_hi": "NPK 20-20 एक संतुलित उर्वरक है जो प्रारंभिक फसल वृद्धि चरणों के लिए समान नाइट्रोजन और फॉस्फोरस प्रदान करता है।",
        "benefits_en": [
            "Balanced nutrition for young plants",
            "Promotes healthy root and shoot growth",
            "Improves nutrient use efficiency",
            "Suitable for starter fertilizer application"
        ],
        "benefits_hi": [
            "युवा पौधों के लिए संतुलित पोषण",
            "स्वस्थ जड़ और शूट विकास को बढ़ावा देता है",
            "पोषक तत्व उपयोग दक्षता में सुधार करता है",
            "स्टार्टर उर्वरक अनुप्रयोग के लिए उपयुक्त"
        ],
        "tips_en": [
            "Apply during early vegetative stage",
            "Suitable for band placement near seeds",
            "Can be used for foliar spray",
            "Follow up with additional nutrients as crop grows"
        ],
        "tips_hi": [
            "प्रारंभिक वनस्पति चरण के दौरान लगाएं",
            "बीज के पास बैंड प्लेसमेंट के लिए उपयुक्त",
            "पर्णीय स्प्रे के लिए उपयोग किया जा सकता है",
            "फसल बढ़ने के साथ अतिरिक्त पोषक तत्वों के साथ अनुसरण करें"
        ]
    },
    "10-26-26": {
        "description_en": "NPK 10-26-26 is a fertilizer with high phosphorus and potassium, ideal for fruiting and flowering crops.",
        "description_hi": "NPK 10-26-26 एक उर्वरक है जिसमें उच्च फॉस्फोरस और पोटेशियम है, जो फल और फूल वाली फसलों के लिए आदर्श है।",
        "benefits_en": [
            "High phosphorus for better flowering",
            "High potassium for fruit quality",
            "Improves crop yield and quality",
            "Enhances disease resistance"
        ],
        "benefits_hi": [
            "बेहतर फूल के लिए उच्च फॉस्फोरस",
            "फल की गुणवत्ता के लिए उच्च पोटेशियम",
            "फसल की उपज और गुणवत्ता में सुधार करता है",
            "रोग प्रतिरोध बढ़ाता है"
        ],
        "tips_en": [
            "Apply during flowering and fruiting stages",
            "Suitable for fruit and vegetable crops",
            "Can be applied through drip irrigation",
            "Supplement with nitrogen if needed"
        ],
        "tips_hi": [
            "फूल और फल चरण के दौरान लगाएं",
            "फल और सब्जी की फसलों के लिए उपयुक्त",
            "ड्रिप सिंचाई के माध्यम से लगाया जा सकता है",
            "आवश्यकता होने पर नाइट्रोजन के साथ पूरक"
        ]
    }
}

def predict_fertilizer(input_data, language='en'):
    """
    Predict fertilizer recommendation
    
    Args:
        input_data: dict with keys Temperature, Humidity, Moisture, Soil_Type, 
                    Crop_Type, Nitrogen, Phosphorous, Potassium
        language: 'en' or 'hi' for response language
    
    Returns:
        dict with fertilizer recommendation and details
    """
    
    if fertilizer_model is None:
        raise Exception("Fertilizer model not loaded. Please train the model first.")
    
    try:
        # Encode categorical features
        soil_encoded = soil_type_encoder.transform([input_data['Soil_Type']])[0]
        crop_encoded = crop_type_encoder.transform([input_data['Crop_Type']])[0]
        
        # Prepare feature array
        features = np.array([[
            input_data['Temperature'],
            input_data['Humidity'],
            input_data['Moisture'],
            soil_encoded,
            crop_encoded,
            input_data['Nitrogen'],
            input_data['Potassium'],
            input_data['Phosphorous']
        ]])
        
        # Scale features
        features_scaled = fertilizer_scaler.transform(features)
        
        # Make prediction
        prediction = fertilizer_model.predict(features_scaled)[0]
        fertilizer_name = fertilizer_label_encoder.inverse_transform([prediction])[0]
        
        # Get prediction probabilities
        probabilities = fertilizer_model.predict_proba(features_scaled)[0]
        confidence = float(max(probabilities) * 100)
        
        # Get fertilizer information
        info = FERTILIZER_INFO.get(fertilizer_name, {})
        
        # Build response
        response = {
            "fertilizer": fertilizer_name,
            "confidence": round(confidence, 2)
        }
        
        # Add language-specific information
        if language == 'hi':
            response["description"] = info.get("description_hi", "")
            response["benefits"] = info.get("benefits_hi", [])
            response["applicationTips"] = info.get("tips_hi", [])
        else:
            response["description"] = info.get("description_en", "")
            response["benefits"] = info.get("benefits_en", [])
            response["applicationTips"] = info.get("tips_en", [])
        
        return response
        
    except Exception as e:
        raise Exception(f"Prediction error: {str(e)}")
