import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logos/logo-rond.png';
import { FaBars, FaTimes, FaHome, FaPlus, FaList, FaHistory, FaExternalLinkAlt } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Bouton d'ouverture pour le menu mobile */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 z-40`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <img src={logo} alt="logo" className="w-12 h-auto" />
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col p-6 space-y-4">
          <Link
            to="/home"
            className="flex items-center hover:bg-gray-700 p-3 rounded transition-colors"
            onClick={toggleSidebar}
          >
            <FaHome className="mr-3" /> Accueil
          </Link>
          <Link
            to="/AddProduct"
            className="flex items-center hover:bg-gray-700 p-3 rounded transition-colors"
            onClick={toggleSidebar}
          >
            <FaPlus className="mr-3" /> Ajouter un produit
          </Link>
          <Link
            to="/ListProduct"
            className="flex items-center hover:bg-gray-700 p-3 rounded transition-colors"
            onClick={toggleSidebar}
          >
            <FaList className="mr-3" /> Liste des produits
          </Link>
          <Link
            to="/HistoryPurchase"
            className="flex items-center hover:bg-gray-700 p-3 rounded transition-colors"
            onClick={toggleSidebar}
          >
            <FaHistory className="mr-3" /> Historique de commande
          </Link>
          {/* Nouveau lien externe avec icône */}
          <a
            href={`http://localhost:${process.env.REACT_APP_PORT_FRONT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:bg-gray-700 p-3 rounded transition-colors"
            onClick={toggleSidebar}
          >
            <FaExternalLinkAlt className="mr-3" /> Aller sur le e-shop
          </a>
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
