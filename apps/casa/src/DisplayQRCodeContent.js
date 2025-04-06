import React from 'react';

// Functie care parsează string-ul QR și returnează un obiect cu produsele și cantitățile
const parseQRCodeData = (data, products) => {
    const items = data.split(","); // Split by comma
    const order = {};

    items.forEach(item => {
        const [id, quantity] = item.split(":"); // Split by colon
        const productId = parseInt(id, 10);
        const productQuantity = parseInt(quantity, 10);

        // Căutăm produsul în lista de produse din Firestore
        const product = products.find(product => product.id === productId);

        if (product) {
            order[product.name] = {
                quantity: productQuantity,
                price: product.price,
                total: (product.price * productQuantity).toFixed(2)
            };
        }
    });

    return order;
};

const DisplayQRCodeContent = ({ qrData, products, onRestart }) => {
    const parsedOrder = parseQRCodeData(qrData, products); // Parse QR data
    console.log("Parsed Order:", parsedOrder);
    const totalOrderPrice = Object.values(parsedOrder)
        .reduce((total, item) => total + parseFloat(item.total), 0)
        .toFixed(2); // Calculate total price

    return (
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Detalii Comandă:</h2>

            {Object.keys(parsedOrder).length > 0 ? (
                <div>
                    <ul>
                        {Object.keys(parsedOrder).map((productName) => {
                            const item = parsedOrder[productName];
                            return (
                                <li key={productName}>
                                    {productName} x{item.quantity} - ${item.total}
                                </li>
                            );
                        })}
                    </ul>

                    <p className="font-bold">Total: ${totalOrderPrice}</p>
                </div>
            ) : (
                <p>Nu au fost găsite produse în codul QR.</p>
            )}

            <button onClick={onRestart} style={{ marginTop: '20px' }}>
                Începe din nou
            </button>
        </div>
    );
};

export default DisplayQRCodeContent;
