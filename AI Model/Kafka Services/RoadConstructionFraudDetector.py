from kafka import KafkaConsumer, KafkaProducer
import joblib
import pandas as pd
import json

# Load model and encoders
model = joblib.load('fraud_detection_model.pkl')
encoders = joblib.load('label_encoders.pkl')
categorical_columns = ['category', 'road_class', 'terrain_type', 'soil_type', 'slope']

# Kafka setup
consumer = KafkaConsumer(
    'request_ai_prediction',
    bootstrap_servers='localhost:9092',
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    group_id='ai_model_group'
)

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

print("✅ AI model Kafka service is running and listening...")

for msg in consumer:
    new_data = msg.value
    try:
        # Turn to DataFrame
        input_df = pd.DataFrame([new_data])

        # Encode categorical columns
        for col in categorical_columns:
            encoder = encoders[col]
            input_df[col] = encoder.transform(input_df[col])

        # Make prediction
        prediction = int(model.predict(input_df)[0])
        result = "Fraudulent" if prediction == 1 else "Legitimate"

        # Add to result
        response = new_data.copy()
        response["prediction"] = prediction
        response["result"] = result

        # Send response to Kafka
        producer.send('response_ai_prediction', value=response)
        print(f"✅ Prediction sent: {result} (application_id={new_data.get('application_id', 'N/A')})")

    except Exception as e:
        print(f"❌ Error processing data: {e}")
