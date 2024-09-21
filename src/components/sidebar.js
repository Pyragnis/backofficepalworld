import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logos/logo-rond.png';

const Sidebar = () => {
  return (
    <div className="h-full flex flex-col w-60 bg-gray-800 text-white"> {/* Réduit la largeur */}
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <img 
            src={logo}
            alt="logo"
            className="w-16 h-auto"  
        />
      </div>

      {/* Menu Links */}
      <nav className="flex flex-col p-4 space-y-6">
        <Link
          to="/home"
          className="hover:bg-gray-700 p-3 rounded transition-colors"
        >
          Accueil
        </Link>
        <Link
          to="/AddProduct"
          className="hover:bg-gray-700 p-3 rounded transition-colors"
        >
          Ajouter un produit
        </Link>
        <Link
          to="/ListProduct"
          className="hover:bg-gray-700 p-3 rounded transition-colors"
        >
          Liste des produits
        </Link>
        <Link
          to="/HistoryPurchase"
          className="hover:bg-gray-700 p-3 rounded transition-colors"
        >
          Historique de commande
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
