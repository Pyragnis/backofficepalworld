import React, { useEffect } from 'react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineInfoCircle } from 'react-icons/ai';

const Alert = ({ message, type = 'success', onClose, position = 'top-right', duration = 3000 }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timeout);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <AiOutlineCheckCircle className="text-green-500 w-6 h-6" />;
      case 'error':
        return <AiOutlineCloseCircle className="text-red-500 w-6 h-6" />;
      case 'info':
        return <AiOutlineInfoCircle className="text-blue-500 w-6 h-6" />;
      default:
        return null;
    }
  };

  const getPositionStyle = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div
      className={`fixed ${getPositionStyle()} flex items-center bg-white border shadow-lg px-4 py-2 rounded-md transition duration-300 
        ${type === 'success' ? 'border-green-500 text-green-600' : type === 'error' ? 'border-red-500 text-red-600' : 'border-blue-500 text-blue-600'}
      `}
      style={{ zIndex: 9999 }}
    >
      {getIcon()}
      <span className="ml-2">{message}</span>
      <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600 focus:outline-none">
        ×
      </button>
    </div>
  );
};

export default Alert;
