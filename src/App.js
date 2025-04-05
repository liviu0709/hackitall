import React, { useState } from 'react';
import MainApp from './MainApp';
import QRScanner from './QRScanner';

function App() {
  const [qrScanned, setQrScanned] = useState(false);

  const handleQRSuccess = (data) => {
    console.log("Cod QR detectat:", data);
    setQrScanned(true);
  };

  return (
      <div>
        {!qrScanned ? <QRScanner onScanSuccess={handleQRSuccess} /> : <MainApp />}
      </div>
  );
}

export default App;
