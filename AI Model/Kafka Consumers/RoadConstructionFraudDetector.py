from kafka import KafkaConsumer, KafkaProducer
import joblib
import pandas as pd
import json
import traceback

model = joblib.load('fraud_detection_model.pkl')
encoders = joblib.load('label_encoders.pkl')
categorical_columns = ['category', 'road_class', 'terrain_type', 'soil_type', 'slope']

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

print("✅ AI model Kafka service is running...")

for msg in consumer:
    new_data = msg.value
    try:
        input_df = pd.DataFrame([new_data])
        if 'application_id' in input_df.columns:
            input_df = input_df.drop(columns=['application_id'])

        for col in categorical_columns:
            input_df[col] = encoders[col].transform(input_df[col])

        prediction = int(model.predict(input_df)[0])
        result = "Fraudulent" if prediction == 1 else "Legitimate"

        response = new_data.copy()
        response["prediction"] = prediction
        response["result"] = result

        producer.send('response_ai_prediction', value=response)
        producer.flush()

        print(f"✅ Prediction sent: {result} (ID={new_data.get('application_id')})")

    except Exception as e:
        print("❌ Error during prediction:")
        traceback.print_exc()
