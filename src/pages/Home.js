import React from 'react';
import Sidebar from '../components/sidebar';
import logo from '../assets/logos/logo-rond.png'; // Assurez-vous que le chemin du logo est correct

const Home = () => {
  return (
    <div className="flex">
      <div className="w-60">
        <Sidebar />
      </div>

      {/* Section principale */}
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold mb-4">Bienvenue dans votre tableau de bord</h1>
        <p className="text-lg text-gray-700 mb-6">
          Ici, vous pouvez gérer vos produits, consulter l'historique de vos commandes, et bien plus encore.
        </p>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Astuces et conseils</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ajoutez de nouveaux produits pour enrichir votre catalogue.</li>
            <li>Consultez l'historique des commandes pour suivre vos ventes.</li>
            <li>Utilisez la barre de navigation pour accéder rapidement aux différentes sections.</li>
          </ul>

          {/* Logo sous le texte mais dans la même div */}
          <div className="flex justify-center mt-8">
            <img src={logo} alt="Logo" className="w-50 h-auto" /> {/* Logo plus grand */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
