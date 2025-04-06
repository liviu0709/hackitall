import React, { useState, useEffect } from 'react';
import QRScanner from './QRScanner';  // Componentele pentru scanare QR
import DisplayQRCodeContent from './DisplayQRCodeContent';  // Componenta care va arăta conținutul codului QR
import { db } from './firebaseConfig';
import { collection, getDocs } from "firebase/firestore";

function CasaApp() {
    const [qrData, setQrData] = useState(null);
    const [showQRContent, setShowQRContent] = useState(false);
    const [restaurant, setRestaurant] = useState('menu');  // Default restaurant
    const [products, setProducts] = useState([]);

    // Fetch products from Firestore
    const fetchProducts = async (restaurant) => {
        console.log("Restaurant selected:", restaurant);
        const productsCollection = collection(db, restaurant);  // Use restaurant name as collection
        const querySnapshot = await getDocs(productsCollection);
        const productsList = querySnapshot.docs.map(doc => doc.data());
        setProducts(productsList);
    };

    useEffect(() => {
        fetchProducts(restaurant);  // Fetch products based on selected restaurant
    }, [restaurant]);

    const handleQRSuccess = (data) => {
        console.log("Cod QR detectat:", data);
        setQrData(data);
        setShowQRContent(true);
    };

    const handleStartOver = () => {
        setQrData(null);
        setShowQRContent(false);
    };

    const handleSelectRestaurant = (selectedRestaurant) => {
        setRestaurant(selectedRestaurant);
        fetchProducts(selectedRestaurant);  // Refetch products for the new restaurant
    };

    return (
        <div className="container">
            {!showQRContent ? (
                <>
                    <button onClick={() => handleSelectRestaurant("menu")}>McDonald's</button>
                    <button onClick={() => handleSelectRestaurant("menu2")}>KFC</button>
                    <QRScanner onScanSuccess={handleQRSuccess} />
                </>
            ) : (
                <DisplayQRCodeContent qrData={qrData} products={products} onRestart={handleStartOver} />
            )}
        </div>
    );
}

export default CasaApp;
