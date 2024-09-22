import React, { createContext, useContext, useState } from 'react';

// Création du contexte
const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ message: '', type: '', isVisible: false });

  const showAlert = (message, type = 'success', duration = 3000) => {
    setAlert({ message, type, isVisible: true });

    // Masquer l'alerte après la durée définie
    setTimeout(() => {
      setAlert({ ...alert, isVisible: false });
    }, duration);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert.isVisible && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg text-white transition duration-300
            ${alert.type === 'success' ? 'bg-green-500' : alert.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}
          `}
          style={{ zIndex: 9999 }}
        >
          {alert.message}
        </div>
      )}
    </AlertContext.Provider>
  );
};
