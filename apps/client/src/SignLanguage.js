import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

function SignLanguage() {
    const webcamRef = useRef(null);
    const [sign, setSign] = useState("");
    const [word, setWord] = useState("");
    const lastAddedRef = useRef(""); // pentru a evita duplicarea
    const isRockRef = useRef(false); // 🤘 activ

    // ✅ 2. Backend prediction (litere)
    useEffect(() => {
        const interval = setInterval(() => {
            if (webcamRef.current && !isRockRef.current) {
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
                                const letter = data.letter.toLowerCase();
                                setSign(letter);
                                if (letter !== lastAddedRef.current) {
                                    setWord(prev => prev + letter);
                                    lastAddedRef.current = letter;
                                }
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
            <p><strong>Cuvânt în construcție:</strong> <span style={{ fontWeight: "bold" }}>{word}</span></p>
        </div>
    );
}

export default SignLanguage;