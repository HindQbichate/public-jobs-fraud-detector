import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib


#1. Load your dataset
df = pd.read_csv('road_contractor_applications_rounded_clean.csv')

#2. Encode categorical columns
categorical_columns = ['category', 'road_class', 'terrain_type', 'soil_type', 'slope']
encoders = {}  # Dictionary to store each encoder

for col in categorical_columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le  # Save encoder for this column

#3. Split features and target
X = df.drop(columns=['is_fraudulent', 'application_id'])
y = df['is_fraudulent']

#4. Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

#5. Model Training
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

#6. Prediction
y_pred = model.predict(X_test)

#7. Evaluation
print("✅ Accuracy:", accuracy_score(y_test, y_pred))
print("\n✅ Classification Report:\n", classification_report(y_test, y_pred))
print("\n✅ Confusion Matrix:\n", confusion_matrix(y_test, y_pred))


#8. Save model and encoders
joblib.dump(model, 'fraud_detection_model.pkl')
joblib.dump(encoders, 'label_encoders.pkl')

print("\n✅ Model and encoders saved successfully!")
