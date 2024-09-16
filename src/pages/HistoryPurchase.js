import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import OrderHistory from '../components/OrderHistory';



const HistoryPurchase = () => {
  return (
    <div className="flex">
      {/* Sidebar - ajustée à une largeur plus petite */}
      <div className="w-60">
        <Sidebar />
      </div>

      {/* Formulaire - occupe l'espace restant */}
      <div className="flex-1 p-6">
        <OrderHistory />
      </div>
    </div>
  );
};


export default HistoryPurchase;