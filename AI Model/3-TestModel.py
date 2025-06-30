import joblib
import pandas as pd

# Load the saved model and encoders
model = joblib.load('fraud_detection_model.pkl')
encoders = joblib.load('label_encoders.pkl')
# Example input as dictionary (new unseen data)

new_data = {
    'company_experience_years': 2,                     # Very low experience
    'previous_similar_projects': 0,                    # Never did similar projects
    'total_employees': 50,                             # Very small company
    'engineers_count': 1,                              # Only 1 engineer
    'machinery_count': 3,                              # Very few machines
    'offered_budget_MAD': 90000000,                    # Suspiciously too low
    'estimated_budget_MAD': 160000000,                 # Should be much higher
    'budget_difference_ratio': -0.4375,                # Way too low (dumping)
    'proposed_duration_days': 500,                     # Unrealistically long
    'total_length_km': 180,                             # Big project
    'road_width_m': 14,                                 # Huge width (Autoroute 4 lanes)
    'lanes': 4,                                         # Autoroute
    'category': 'Autoroute',                            # High complexity
    'road_class': 'Primary',
    'terrain_type': 'Mountainous',                      # Hard terrain
    'soil_type': 'Rocky',
    'slope': 'High',                                    # Challenging slope
    'compliance_issues_count': 3,                       # 🚩 Many compliance issues
    'technical_score': 45.2,                            # Low technical score
    'financial_score': 58.3                             # Below the safe threshold
}


input_df = pd.DataFrame([new_data])

# Apply label encoders to categorical columns
categorical_columns = ['category', 'road_class', 'terrain_type', 'soil_type', 'slope']

for col in categorical_columns:
    encoder = encoders[col]
    input_df[col] = encoder.transform(input_df[col])


# Make prediction
prediction = model.predict(input_df)[0]

# Interpret
result = "Fraudulent 🚩" if prediction == 1 else "Legitimate ✅"

print(f"Prediction: {result}")
