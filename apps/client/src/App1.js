import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from './firebaseConfig';
import { Card, CardContent } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import { QRCodeSVG } from 'qrcode.react';
import './App1.css';

export default function DriveThruMockApp({ collectionName, onLaunchMainApp }) {
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
  const total = order.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2);

  const itemCounts = {};
  order.forEach(item => {
    itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
  });

  const generateQRCodeData = () => {
    return Object.keys(itemCounts)
        .map(id => `${id}:${itemCounts[id]}`)
        .join(',');
  };

  const nextStage = () => {
    if (stage === "ordering" && order.length > 0) setStage("confirmation");
    else if (stage === "confirmation") onLaunchMainApp();
    else if (stage === "payment") setStage("complete");
  };

  const prevStage = () => {
    if (stage === "confirmation") setStage("ordering");
    else if (stage === "payment") setStage("confirmation");
    else if (stage === "complete") setStage("payment");
  };

  return (
      <div className="grid">
        <h1>🚗 Drive-Thru Ordering System</h1>

        {stage === "ordering" && (
            <div className="menu-section">
              <p className="text-lg font-semibold">Select your items:</p>
              <div className="menu-grid">
                {menu.map((item) => (
                    <Card key={item.id}>
                      <CardContent>
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-price">${Number(item.price).toFixed(2)}</p>
                        <Button onClick={() => addToOrder(item)}>
                          Add to Order
                        </Button>
                      </CardContent>
                    </Card>
                ))}
              </div>
              <div className="total-price">
                Current Total: ${total}
              </div>
              <Button onClick={nextStage} disabled={order.length === 0}>
                Review Order
              </Button>
            </div>
        )}

        {stage === "confirmation" && (
            <Card>
              <CardContent>
                <p className="text-lg font-semibold">Order Summary:</p>
                <div className="order-summary">
                  {Object.keys(itemCounts).map(id => {
                    const item = menu.find(item => item.id.toString() === id);
                    const quantity = itemCounts[id];
                    return (
                        <div key={id} className="order-item">
                          <div className="item-details">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">x{quantity}</span>
                            <span className="item-subtotal">${(item.price * quantity).toFixed(2)}</span>
                          </div>
                          <button
                              className="remove-button"
                              onClick={() => removeFromOrder(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                    );
                  })}
                </div>
                <div className="total-price">
                  Total: ${total}
                </div>
                <div className="button-group">
                  <Button variant="secondary" onClick={() => setShowQRCode(!showQRCode)}>
                    {showQRCode ? 'Hide QR' : 'Show QR'}
                  </Button>
                  {showQRCode && (
                      <div className="qr-code">
                        <QRCodeSVG value={generateQRCodeData()} size={200} />
                      </div>
                  )}
                  <Button onClick={prevStage}>
                    Back to Menu
                  </Button>
                  <Button onClick={nextStage}>
                    Proceed to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
        )}
      </div>
  );
}