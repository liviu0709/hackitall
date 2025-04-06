from flask import Flask, request, jsonify
import base64
import cv2
import numpy as np
from detector import GestureRecognizer
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # permite cereri din React (CORS fix)

recognizer = GestureRecognizer()

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    if "image" not in data:
        return jsonify({"error": "No image provided"}), 400

    try:
        # decodează poza din base64
        img_data = data["image"].split(",")[1]
        img_bytes = base64.b64decode(img_data)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # procesează frame-ul prin MediaPipe
        recognizer.process_frame(frame)

        # returnează litera
        letter = recognizer.get_current_letter()
        return jsonify({"letter": letter})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
