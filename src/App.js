import React, { useState } from 'react';
import { Card, CardContent } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import { QRCodeSVG } from 'qrcode.react'; // Correct import for QR code generation

const mockMenu = [
  { id: 1, name: "Big Mac", price: 5.99 },
  { id: 2, name: "McChicken", price: 4.49 },
  { id: 3, name: "Fries", price: 2.49 },
  { id: 4, name: "Coke", price: 1.99 },
];

export default function DriveThruMockApp() {
  const [order, setOrder] = useState([]);
  const [stage, setStage] = useState("ordering");
  const [showQRCode, setShowQRCode] = useState(false); // State to toggle QR visibility

  const addToOrder = (item) => {
    setOrder([...order, item]);
  };

  const removeFromOrder = (itemId) => {
    setOrder(order.filter(item => item.id !== itemId));
  };

  const nextStage = () => {
    if (stage === "ordering" && order.length > 0) {
      setStage("confirmation");
    } else if (stage === "confirmation") {
      setStage("payment");
    } else if (stage === "payment") {
      setStage("complete");
    }
  };

  const prevStage = () => {
    if (stage === "confirmation") {
      setStage("ordering");
    } else if (stage === "payment") {
      setStage("confirmation");
    } else if (stage === "complete") {
      setStage("payment");
    }
  };

  const total = order.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  // Group items by id and count quantities
  const itemCounts = {}; // Declare itemCounts at the top of the confirmation stage
  order.forEach(item => {
    itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
  });

  // Generate the grouped order summary with product IDs and quantities
  const generateGroupedOrderSummary = () => {
    return Object.keys(itemCounts).map(id => {
      const item = mockMenu.find(item => item.id.toString() === id); // Find item name and price
      const quantity = itemCounts[id];
      return `${item.name} x${quantity} - $${(item.price * quantity).toFixed(2)}`;
    }).join(', ');
  };

  const orderSummary = generateGroupedOrderSummary();

  return (
      <div className="grid gap-4 p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-center">🚗 Drive-Thru Ordering System</h1>

        {stage === "ordering" && (
            <div className="grid gap-2">
              <p className="text-lg font-semibold">Select your items:</p>
              {mockMenu.map((item) => (
                  <Button key={item.id} onClick={() => addToOrder(item)}>
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
                  {/* Display each item with quantity in the confirmation stage */}
                  {Object.keys(itemCounts).map(id => {
                    const item = mockMenu.find(item => item.id.toString() === id);
                    const quantity = itemCounts[id];
                    return (
                        <li key={id}>
                          {item.name} x{quantity} - ${ (item.price * quantity).toFixed(2) }
                          <Button
                              variant="secondary"
                              onClick={() => removeFromOrder(item.id)}
                              className="ml-4"
                          >
                            Remove
                          </Button>
                        </li>
                    );
                  })}
                </ul>
                <p className="font-bold">Total: ${total}</p>

                {/* Show QR Code Button in Confirmation Stage */}
                <Button variant="secondary" onClick={() => setShowQRCode(!showQRCode)}>
                  {showQRCode ? 'Hide QR' : 'Show QR'}
                </Button>

                {/* Show QR Code if showQRCode is true */}
                {showQRCode && (
                    <div className="mt-4 text-center">
                      <QRCodeSVG value={orderSummary} size={256} />
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

        {/* Back Button */}
        {stage !== "ordering" && stage !== "complete" && (
            <Button variant="secondary" onClick={prevStage}>
              Back
            </Button>
        )}

        {/* Next Button */}
        {stage !== "complete" && (
            <Button
                variant="secondary"
                onClick={nextStage}
                disabled={total === "0.00"}
            >
              {stage === "ordering"
                  ? "Next: Confirm Order"
                  : stage === "confirmation"
                      ? "Next: Pay"
                      : "Finish Order"}
            </Button>
        )}
      </div>
  );
}
