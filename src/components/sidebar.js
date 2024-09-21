import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logos/logo-rond.png';
import { FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Bouton d'ouverture pour le menu mobile */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:flex flex-col w-64 transition-transform duration-300 z-40`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <img src={logo} alt="logo" className="w-12 h-auto" />
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col p-6 space-y-4">
          <Link
            to="/home"
            className="hover:bg-gray-700 p-3 rounded transition-colors"
            onClick={toggleSidebar}
          >
            Accueil
          </Link>
          <Link
            to="/AddProduct"
            className="hover:bg-gray-700 p-3 rounded transition-colors"
            onClick={toggleSidebar}
          >
            Ajouter un produit
          </Link>
          <Link
            to="/ListProduct"
            className="hover:bg-gray-700 p-3 rounded transition-colors"
            onClick={toggleSidebar}
          >
            Liste des produits
          </Link>
          <Link
            to="/HistoryPurchase"
            className="hover:bg-gray-700 p-3 rounded transition-colors"
            onClick={toggleSidebar}
          >
            Historique de commande
          </Link>
        </nav>
      </div>

      {/* Overlay pour masquer le Sidebar en mode mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
