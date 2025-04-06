import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

function SignLanguage() {
    const webcamRef = useRef(null);
    const [sign, setSign] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            if (webcamRef.current) {
                const screenshot = webcamRef.current.getScreenshot();
                if (screenshot) {
                    fetch("http://localhost:5000/predict", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image: screenshot }),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.letter && data.letter !== "not detected") {
                                setSign(data.letter);
                            }
                        })
                        .catch((err) => console.error("Eroare:", err));
                }
            }
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h3><strong>Limbajul semnelor (client)</strong></h3>
            <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                mirrored={true}
                style={{ width: 400, height: 300 }}
            />
            <p><strong>Semn recunoscut:</strong> <span style={{ color: "green" }}>{sign}</span></p>
        </div>
    );
}

export default SignLanguage;