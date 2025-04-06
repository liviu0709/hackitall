import React, { useState } from 'react';
import App1 from './App1';
import MainApp from './MainApp';
import FinalScreen from './FinalScreen';
import QRScanner from './QRScanner';

function App() {
    const [collectionName, setCollectionName] = useState(null);
    const [showMainApp, setShowMainApp] = useState(false);
    const [showFinalScreen, setShowFinalScreen] = useState(false);

    const handleQRSuccess = (data) => {
        console.log("Cod QR detectat:", data);
        setCollectionName(data);
    };

    const handleLaunchMainApp = () => {
        setShowMainApp(true);
    };

    const handleFinishOrder = () => {
        setShowFinalScreen(true);
    };

    const handleStartOver = () => {
        setCollectionName(null);
        setShowMainApp(false);
        setShowFinalScreen(false);
    };

    if (!collectionName) {
        return <QRScanner onScanSuccess={handleQRSuccess} />;
    }

    if (showFinalScreen) {
        return <FinalScreen onRestart={handleStartOver} />;
    }

    if (showMainApp) {
        return <MainApp onFinishOrder={handleFinishOrder} />;
    }

    return <App1 collectionName={collectionName} onLaunchMainApp={handleLaunchMainApp} />;
}

export default App;
