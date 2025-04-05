import React, { useState } from 'react';
import MainApp from './MainApp';
import App1 from './App1';
import QRScanner from './QRScanner';

function App() {
    const [qrScanned, setQrScanned] = useState(false);

    const handleQRSuccess = (data) => {
        console.log("Cod QR detectat:", data);
        setQrScanned(true);
    };

    return (
        <div>
            {!qrScanned ? <QRScanner onScanSuccess={handleQRSuccess} /> : <App1 />}
        </div>
    );
}

export default App;
