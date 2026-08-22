import pickle
import numpy as np
import os

class YieldService:
    def __init__(self):
        self.model = None
        self.encoders = None
        self.load_model()
    
    def load_model(self):
        """Load the trained yield prediction model and encoders"""
        try:
            model_path = os.path.join('models', 'yield_model.pkl')
            encoders_path = os.path.join('models', 'yield_encoders.pkl')
            
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found at {model_path}")
            
            if not os.path.exists(encoders_path):
                raise FileNotFoundError(f"Encoders file not found at {encoders_path}")
            
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            with open(encoders_path, 'rb') as f:
                self.encoders = pickle.load(f)
            
            print("✓ Yield prediction model and encoders loaded successfully")
            
        except Exception as e:
            print(f"✗ Error loading yield prediction model: {str(e)}")
            raise
    
    def get_crops(self):
        """Get list of available crops"""
        return list(self.encoders['Crop'].classes_)
    
    def get_seasons(self):
        """Get list of available seasons"""
        return list(self.encoders['Season'].classes_)
    
    def get_states(self):
        """Get list of available states"""
        return list(self.encoders['State'].classes_)
    
    def get_soil_types(self):
        """Get list of available soil types"""
        return list(self.encoders['Soil_Type'].classes_)
    
    def predict_yield(self, input_data):
        """
        Predict crop yield based on input parameters
        
        Parameters:
        - crop: Crop name
        - season: Growing season
        - state: State name
        - area: Area in hectares
        - rainfall: Annual rainfall in mm
        - fertilizer: Fertilizer used in kg
        - pesticide: Pesticide used in kg
        - temperature: Average temperature in °C
        - irrigation: 'Yes' or 'No'
        - soil_type: Type of soil
        
        Returns:
        - Predicted yield in kg/hectare
        """
        try:
            # Encode categorical variables
            crop_encoded = self.encoders['Crop'].transform([input_data['crop']])[0]
            season_encoded = self.encoders['Season'].transform([input_data['season']])[0]
            state_encoded = self.encoders['State'].transform([input_data['state']])[0]
            irrigation_encoded = self.encoders['Irrigation'].transform([input_data['irrigation']])[0]
            soil_type_encoded = self.encoders['Soil_Type'].transform([input_data['soil_type']])[0]
            
            # Prepare features in the correct order
            features = np.array([[
                crop_encoded,
                season_encoded,
                state_encoded,
                float(input_data['area']),
                float(input_data['rainfall']),
                float(input_data['fertilizer']),
                float(input_data['pesticide']),
                float(input_data['temperature']),
                irrigation_encoded,
                soil_type_encoded
            ]])
            
            # Predict
            predicted_yield = self.model.predict(features)[0]
            
            # Calculate total production
            total_production = predicted_yield * float(input_data['area'])
            
            # Get yield category
            yield_category = self.categorize_yield(predicted_yield, input_data['crop'])
            
            # Generate recommendations
            recommendations = self.generate_recommendations(
                input_data, predicted_yield, yield_category
            )
            
            return {
                'predicted_yield': round(predicted_yield, 2),
                'total_production': round(total_production, 2),
                'yield_category': yield_category,
                'recommendations': recommendations
            }
            
        except Exception as e:
            raise Exception(f"Error in yield prediction: {str(e)}")
    
    def categorize_yield(self, yield_value, crop):
        """Categorize yield as Low, Medium, High, or Excellent"""
        # Yield thresholds vary by crop type
        thresholds = {
            'Rice': {'low': 3500, 'medium': 4200, 'high': 4800},
            'Wheat': {'low': 3000, 'medium': 3600, 'high': 4000},
            'Cotton': {'low': 2000, 'medium': 2250, 'high': 2400},
            'Sugarcane': {'low': 60000, 'medium': 67000, 'high': 70000},
            'Maize': {'low': 2800, 'medium': 3300, 'high': 3600},
            'Jute': {'low': 2500, 'medium': 2750, 'high': 2900},
            'Bajra': {'low': 1600, 'medium': 1850, 'high': 2100},
            'Groundnut': {'low': 2000, 'medium': 2250, 'high': 2500},
            'Soybean': {'low': 2200, 'medium': 2450, 'high': 2700},
            'Pulses': {'low': 1000, 'medium': 1150, 'high': 1300}
        }
        
        # Get thresholds for the crop, default to Rice if not found
        crop_thresholds = thresholds.get(crop, thresholds['Rice'])
        
        if yield_value < crop_thresholds['low']:
            return 'Low'
        elif yield_value < crop_thresholds['medium']:
            return 'Medium'
        elif yield_value < crop_thresholds['high']:
            return 'High'
        else:
            return 'Excellent'
    
    def generate_recommendations(self, input_data, predicted_yield, category):
        """Generate farming recommendations based on prediction"""
        recommendations = {
            'en': [],
            'hi': []
        }
        
        # Irrigation recommendations
        if input_data['irrigation'] == 'No':
            recommendations['en'].append('Install drip or sprinkler irrigation to boost yield by 20-30%')
            recommendations['hi'].append('उपज में 20-30% वृद्धि के लिए ड्रिप या स्प्रिंकलर सिंचाई स्थापित करें')
        
        # Fertilizer recommendations
        if float(input_data['fertilizer']) < 100:
            recommendations['en'].append('Increase fertilizer application for better soil nutrition')
            recommendations['hi'].append('बेहतर मिट्टी पोषण के लिए उर्वरक का उपयोग बढ़ाएं')
        
        # Rainfall recommendations
        if float(input_data['rainfall']) < 800:
            recommendations['en'].append('Consider water conservation and rainwater harvesting methods')
            recommendations['hi'].append('जल संरक्षण और वर्षा जल संचयन विधियों पर विचार करें')
        
        # Category-based recommendations
        if category == 'Low':
            recommendations['en'].append('Consult agricultural experts for soil testing and crop management')
            recommendations['hi'].append('मिट्टी परीक्षण और फसल प्रबंधन के लिए कृषि विशेषज्ञों से परामर्श करें')
            recommendations['en'].append('Consider crop rotation to improve soil health')
            recommendations['hi'].append('मिट्टी की सेहत सुधारने के लिए फसल चक्र पर विचार करें')
        elif category == 'Medium':
            recommendations['en'].append('Apply organic fertilizers to enhance yield quality')
            recommendations['hi'].append('उपज की गुणवत्ता बढ़ाने के लिए जैविक उर्वरक लगाएं')
        elif category in ['High', 'Excellent']:
            recommendations['en'].append('Maintain current farming practices for consistent results')
            recommendations['hi'].append('लगातार परिणामों के लिए वर्तमान खेती के तरीके बनाए रखें')
        
        # Default recommendation
        if len(recommendations['en']) == 0:
            recommendations['en'].append('Follow recommended agricultural practices for your region')
            recommendations['hi'].append('अपने क्षेत्र के लिए अनुशंसित कृषि पद्धतियों का पालन करें')
        
        return recommendations

# Create singleton instance
yield_service = YieldService()
