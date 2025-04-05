import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from './firebaseConfig';
import { Card, CardContent } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import { QRCodeSVG } from 'qrcode.react';
import './App1.css';

export default function DriveThruMockApp({ collectionName }) {
  const [menu, setMenu] = useState([]);
  const [order, setOrder] = useState([]);
  const [stage, setStage] = useState("ordering");
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const items = querySnapshot.docs.map(doc => doc.data());
        setMenu(items);
      } catch (error) {
        console.error("Eroare la încărcarea meniului:", error);
      }
    };

    if (collectionName) {
      fetchMenu();
    }
  }, [collectionName]);


  const addToOrder = (item) => setOrder([...order, item]);
  const removeFromOrder = (itemId) => setOrder(order.filter(item => item.id !== itemId));
  const total = order.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const itemCounts = {};
  order.forEach(item => {
    itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
  });

  const generateOrderSummary = () => {
    return Object.keys(itemCounts).map(id => {
      const item = menu.find(item => item.id.toString() === id);
      const quantity = itemCounts[id];
      return `${item.name} x${quantity} - $${(item.price * quantity).toFixed(2)}`;
    }).join(', ');
  };

  const generateQRCodeData = () => {
    return Object.keys(itemCounts)
        .map(id => `${id}:${itemCounts[id]}`)
        .join(',');
  };

  const nextStage = () => {
    if (stage === "ordering" && order.length > 0) setStage("confirmation");
    else if (stage === "confirmation") setStage("payment");
    else if (stage === "payment") setStage("complete");
  };

  const prevStage = () => {
    if (stage === "confirmation") setStage("ordering");
    else if (stage === "payment") setStage("confirmation");
    else if (stage === "complete") setStage("payment");
  };

  const orderSummary = generateOrderSummary();
  const qrCodeData = generateQRCodeData();

  return (
      <div className="grid gap-4 p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-center">🚗 Drive-Thru Ordering System</h1>

        {stage === "ordering" && (
            <div className="grid gap-2">
              <p className="text-lg font-semibold">Select your items:</p>
              {menu.map((item) => (
                  <Button key={item.id} onClick={() => addToOrder(item)} className="mb-2">
                    {item.name} - ${item.price.toFixed(2)}
                  </Button>
              ))}
              <p className="mt-4 font-semibold">Current Total: ${total}</p>
            </div>
        )}

        {stage === "confirmation" && (
            <Card>
              <CardContent className="p-4">
                <p className="text-lg font-semibold">Order Summary:</p>
                <ul className="mb-2">
                  {Object.keys(itemCounts).map(id => {
                    const item = menu.find(item => item.id.toString() === id);
                    const quantity = itemCounts[id];
                    return (
                        <li key={id}>
                          {item.name} x{quantity} - ${ (item.price * quantity).toFixed(2) }
                          <Button variant="secondary" onClick={() => removeFromOrder(item.id)} className="ml-4 mb-2">
                            Remove
                          </Button>
                        </li>
                    );
                  })}
                </ul>
                <p className="font-bold">Total: ${total}</p>
                <Button variant="secondary" onClick={() => setShowQRCode(!showQRCode)} className="mb-2">
                  {showQRCode ? 'Hide QR' : 'Show QR'}
                </Button>

                {showQRCode && (
                    <div className="mt-4 text-center">
                      <QRCodeSVG value={qrCodeData} size={256} />
                      <p className="mt-2">Scan this QR code to confirm your order at the drive-thru!</p>
                    </div>
                )}
              </CardContent>
            </Card>
        )}

        {stage === "payment" && (
            <div>
              <p className="text-lg font-semibold">Please proceed to payment...</p>
              <p className="text-sm text-gray-500">(Mocking payment gateway)</p>
            </div>
        )}

        {stage === "complete" && (
            <div>
              <p className="text-green-600 text-lg font-bold">✅ Order Complete!</p>
              <p>Thank you for your order. Please drive to the next window. 🚗💨</p>
            </div>
        )}

        {stage !== "ordering" && stage !== "complete" && (
            <Button variant="secondary" onClick={prevStage} className="mb-2">Back</Button>
        )}

        {stage !== "complete" && (
            <Button
                variant="secondary"
                onClick={nextStage}
                disabled={total === "0.00"}
                className="mb-2"
            >
              {stage === "ordering" ? "Next: Confirm Order"
                  : stage === "confirmation" ? "Next: Pay" : "Finish Order"}
            </Button>
        )}
      </div>
  );
}
