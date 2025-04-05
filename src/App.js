// App.js
import React, { useState } from 'react';
import App1 from './App1';
import QRScanner from './QRScanner';

function App() {
    const [collectionName, setCollectionName] = useState(null);

    const handleQRSuccess = (data) => {
        console.log("Cod QR detectat:", data);
        setCollectionName(data); // exemplu: "menu", "menu2"
    };

    return (
        <div>
            {!collectionName ? (
                <QRScanner onScanSuccess={handleQRSuccess} />
            ) : (
                <App1 collectionName={collectionName} />
            )}
        </div>
    );
}

export default App;
