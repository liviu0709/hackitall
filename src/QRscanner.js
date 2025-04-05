// QRScanner.js
import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess }) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: 250 },
            false
        );

        scanner.render(
            (decodedText, decodedResult) => {
                console.log("Cod detectat:", decodedText);
                scanner.clear();
                onScanSuccess(decodedText);
            },
            (errorMessage) => {
                // Ignoră erorile de scanare individuale
            }
        );

        return () => {
            scanner.clear().catch(error => console.error("Eroare la cleanup:", error));
        };
    }, [onScanSuccess]);

    return (
        <div style={{ padding: 20 }}>
            <h2>Scanează un cod QR pentru a continua</h2>
            <div id="reader" style={{ width: "100%" }}></div>
        </div>
    );
};

export default QRScanner;
