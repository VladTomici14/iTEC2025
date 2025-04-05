# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from agent import ChatGPTIntegration
import os

from models.brain_tumor.BrainTumor import BrainTumorModel
from models.mri.MRI import MRIModel
from utils import *

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

chatgpt = ChatGPTIntegration()
fileProcessing = FileProcessing()
mri = MRIModel()
brainTumor = BrainTumorModel()

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

        path = f"./uploads/{f.filename}"

        currentMri = False
        currentTumor = False


        # verifying if the parsed file is an image
        if fileProcessing.isImage(path):
            currentMri = mri.isMRI(path)
            if currentMri:
                currentTumor = brainTumor.hasBrainTumor(path)
            else:
                # the parsed image is not an mri
                pass
        else:
            # the file is not an image, so we can't do much
            # We can either skip it or handle it differently
            pass

        current_file = FileStructure(base_path=path,
                                     isMri=currentMri,
                                     hasTumor=currentTumor)


        print(f"{current_file.base_path} - {current_file.isMri} - {current_file.hasTumor}")


        f.save(path)
        saved_files.append(current_file)

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
