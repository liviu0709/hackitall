import React from 'react';

export default function FinalScreen({ onRestart }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>✅ Comandă finalizată 🚗</h1>
            <p style={{ fontSize: '18px', marginBottom: '40px' }}>
                Deplasați-vă la fereastra următoare pentru finalizarea plății și ridicarea comenzii!<br />
                Vă mulțumim și o zi bună!
            </p>
            <button
                onClick={onRestart}
                style={{
                    backgroundColor: '#2e7d32',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    cursor: 'pointer'
                }}
            >
                Comandă nouă
            </button>
        </div>
    );
}
