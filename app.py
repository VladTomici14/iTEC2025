# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from agent import ChatGPTIntegration
import os
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

api_key = "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"

chatgpt = ChatGPTIntegration(api_key)
@app.route("/api/chat", methods=["POST"])
def chat():
    message = request.form.get('message')
    files = request.files.getlist('files')

    saved_files = []
    for f in files:
        path = os.path.join("./uploads", f.filename)
        f.save(path)
        saved_files.append(path)

    print("User message:", message)
    print("Received files:", [f.filename for f in files])
    saved_files = []
    for f in files:
        path = f"./uploads/{f.filename}"  # Make sure 'uploads/' exists
        f.save(path)
        saved_files.append(path)

    # Use dummy data for now
    patient_data = {
        "patient_id": "P12345",
        "age": 45,
        "gender": "Female",
        "medical_history": "N/A",
        "previous_treatments": "N/A"
    }
    model_results = {
        "detection": "Unknown",
        "location": "N/A",
        "confidence": 0
    }

    response = chatgpt.get_response(patient_data, model_results, message)

    return jsonify({"message": response})

if __name__ == "__main__":
    app.run(port=3000)
