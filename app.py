# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from agent import ChatGPTIntegration

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

api_key = "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"

chatgpt = ChatGPTIntegration(api_key)
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    patient_data = data.get("patientData")
    model_results = data.get("modelResults")
    query = data.get("message")

    try:
        response = chatgpt.get_response(patient_data, model_results, query)
        return jsonify({"message": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=3000)
