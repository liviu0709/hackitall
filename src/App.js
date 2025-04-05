import React, { useState } from 'react';
import { Card, CardContent } from "./components/ui/Card";
import { Button } from "./components/ui/Button";

const mockMenu = [
  { id: 1, name: "Big Mac", price: 5.99 },
  { id: 2, name: "McChicken", price: 4.49 },
  { id: 3, name: "Fries", price: 2.49 },
  { id: 4, name: "Coke", price: 1.99 },
];

export default function DriveThruMockApp() {
  const [order, setOrder] = useState([]);
  const [stage, setStage] = useState("ordering");

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

              {/* Show the current total while ordering */}
              <p className="mt-4 font-semibold">Current Total: ${total}</p>
            </div>
        )}

        {stage === "confirmation" && (
            <Card>
              <CardContent className="p-4">
                <p className="text-lg font-semibold">Order Summary:</p>
                <ul className="mb-2">
                  {order.map((item, index) => (
                      <li key={index}>
                        {item.name} - ${item.price.toFixed(2)}
                        <Button
                            variant="secondary"
                            onClick={() => removeFromOrder(item.id)}
                            className="ml-4"
                        >
                          Remove
                        </Button>
                      </li>
                  ))}
                </ul>
                <p className="font-bold">Total: ${total}</p>
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
        {stage !== "ordering" && stage != "complete" && (
            <Button variant="secondary" onClick={prevStage}>
              Back
            </Button>
        )}

        {/* Next Button */}
        {stage !== "complete" && (
            <Button
                variant="secondary"
                onClick={nextStage}
                disabled={total === "0.00"} // Disable if total is $0
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
