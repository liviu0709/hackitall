import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess }) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                rememberLastUsedCamera: true
            },
            false
        );

        scanner.render(
            (decodedText) => {
                console.log("Cod detectat:", decodedText);
                scanner.clear();
                onScanSuccess(decodedText);
            },
            (errorMessage) => {
                console.warn("Eroare scanare:", errorMessage);
            }
        );

        return () => {
            scanner.clear().catch((err) => console.error("Eroare la cleanup:", err));
        };
    }, [onScanSuccess]);

    return (
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Scanează un cod QR pentru a continua</h2>
            <div id="reader" style={{ width: '300px', height: '300px', marginTop: '20px' }}></div>
        </div>
    );
};

export default QRScanner;
