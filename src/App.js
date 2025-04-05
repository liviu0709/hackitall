import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import SignLanguage from "./SignLanguage";

function App() {
  const [operatorText, setOperatorText] = useState("");
  const [clientText, setClientText] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(null);
  const recognitionRef = useRef(null);
  const finalTextRef = useRef(""); // pentru transcriere continuă fără duplicare

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ro-RO';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          if (result.isFinal) {
            finalTextRef.current += transcript + " ";
            saveMessage("operator", transcript.trim());
          } else {
            interimTranscript += transcript;
          }
        }

        setOperatorText((finalTextRef.current + interimTranscript).trim());
      };

      recognitionRef.current = recognition;
    } else {
      alert("Browserul tău nu suportă SpeechRecognition");
    }
  }, []);

  const startListening = () => {
    recognitionRef.current && recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current && recognitionRef.current.stop();
  };

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(clientText);
    utterance.lang = 'ro-RO';

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        const cleanText = clientText.replace(/[.,!?]/g, '');
        const spokenText = cleanText.substring(0, charIndex);
        const spokenWords = spokenText.trim().split(/\s+/);
        setHighlightIndex(spokenWords.length);
      }
    };

    utterance.onend = () => {
      setHighlightIndex(null);
    };

    speechSynthesis.speak(utterance);
    saveMessage("client", clientText);
  };

  const saveMessage = async (sender, message) => {
    try {
      await addDoc(collection(db, "messages"), {
        sender,
        message,
        createdAt: new Date()
      });
      console.log(`[Firestore] Salvat mesaj de la ${sender}: ${message}`);
    } catch (err) {
      console.error("Eroare la salvare:", err);
    }
  };

  return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Operator Panel */}
          <div style={{ flex: 1, border: '1px solid #ccc', padding: 10 }}>
            <h2>Operator (Casier)</h2>
            <button onClick={startListening}>Start Microfon</button>
            <button onClick={stopListening}>Stop</button>
            <textarea
                rows={8}
                value={operatorText}
                readOnly
                style={{
                  width: '100%',
                  marginTop: 10,
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  fontFamily: 'monospace'
                }}
            />
          </div>

          {/* Client Panel */}
          <div style={{ flex: 1, border: '1px solid #ccc', padding: 10 }}>
            <h2>Client (Surdo-Mut)</h2>

            <h4>Zona de vizualizare a mesajului (va fi citit cu voce):</h4>
            <div
                style={{
                  border: '1px solid #ccc',
                  minHeight: '80px',
                  padding: '10px',
                  backgroundColor: '#f9f9f9',
                  whiteSpace: 'wrap',
                  wordBreak: 'break-word',
                  marginBottom: '10px'
                }}
            >
              {clientText.trim().split(/\s+/).map((word, index) => (
                  <span
                      key={index}
                      style={{
                        color: index === highlightIndex ? 'green' : 'black',
                        fontWeight: index === highlightIndex ? 'bold' : 'normal',
                        marginRight: '5px'
                      }}
                  >
                {word}
              </span>
              ))}
            </div>

            <h4>Scrie aici mesajul tău:</h4>
            <input
                type="text"
                value={clientText}
                onChange={(e) => setClientText(e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
            />
            <button onClick={handleSpeak}>
              Convertește în voce
            </button>
          </div>
        </div>

        {/* Sign Language Camera Section */}
        <div style={{ marginTop: '40px', borderTop: '1px solid #aaa', paddingTop: '20px' }}>
          <SignLanguage />
        </div>
      </div>
  );
}

export default App;
