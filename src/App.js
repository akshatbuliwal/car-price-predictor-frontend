from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model and preprocessing objects
model = pickle.load(open("LinearRegressionModel.pkl", "rb"))
onehot = pickle.load(open("OneHotEncoder.pkl", "rb"))
scaler = pickle.load(open("StandardScaler.pkl", "rb"))
data = pd.read_csv("Cleaned_Car_data.csv")

@app.route("/options", methods=["GET"])
def get_dropdown_options():
    try:
        companies = sorted(data["company"].unique())
        models_by_company = {
            company: sorted(data[data["company"] == company]["name"].unique())
            for company in companies
        }
        years = sorted([int(y) for y in data["year"].unique()])
        fuel_types = sorted(data["fuel_type"].unique())

        return jsonify({
            "companies": companies,
            "models_by_company": models_by_company,
            "years": years,
            "fuel_types": fuel_types
        })
    except Exception as e:
        print("❌ Error in /options:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/predict", methods=["POST"])
def predict_price():
    try:
        content = request.json
        print("📦 Received JSON:", content)

        # Validate required fields
        required_fields = ["company", "name", "year", "fuel_type", "kms_driven"]
        if not content or not all(field in content for field in required_fields):
            raise ValueError("Missing one or more required fields")

        # Extract and preprocess input
        company = content["company"]
        name = content["name"]
        year = int(content["year"])
        fuel_type = content["fuel_type"]
        kms_driven = int(content["kms_driven"])

        query_df = pd.DataFrame([[name, company, year, kms_driven, fuel_type]],
                                columns=["name", "company", "year", "kms_driven", "fuel_type"])

        transformed_cat = onehot.transform(query_df[["name", "company", "fuel_type"]])
        scaled_num = scaler.transform(query_df[["year", "kms_driven"]])
        final_input = np.hstack((transformed_cat.toarray(), scaled_num))

        # Make prediction
        predicted_price = model.predict(final_input)[0]

        return jsonify({"estimated_price": round(predicted_price, 2)})

    except Exception as e:
        print("❌ Error during prediction:", str(e))
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
