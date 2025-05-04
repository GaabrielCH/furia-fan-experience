import React, { useState } from 'react';
import { initializeFirebaseData } from '../initializeData';

const InitializeButton = () => {
  const [initializing, setInitializing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleInitialize = async () => {
    setInitializing(true);
    setSuccess(false);
    setError(false);
    
    try {
      const result = await initializeFirebaseData();
      if (result) {
        setSuccess(true);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Erro na inicialização:', err);
      setError(true);
    } finally {
      setInitializing(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000 }}>
      <button 
        onClick={handleInitialize}
        disabled={initializing}
        style={{
          padding: '8px 16px',
          backgroundColor: initializing ? '#666' : success ? '#00cc66' : error ? '#ff3333' : '#00ff7f',
          color: '#000',
          border: 'none',
          borderRadius: '4px',
          cursor: initializing ? 'not-allowed' : 'pointer'
        }}
      >
        {initializing ? 'Inicializando...' : success ? 'Dados inicializados!' : error ? 'Erro! Tente novamente' : 'Iniciar banco de dados'}
      </button>
    </div>
  );
};

export default InitializeButton;