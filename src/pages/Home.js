// Home.js
import React from 'react';
import Sidebar from '../components/sidebar';

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <main className="flex-1 p-8">
        <section className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Bienvenue sur votre tableau de bord</h1>
          <p className="text-gray-600 mb-8">
            Ici, vous pouvez gérer vos produits, consulter l'historique de vos commandes, et bien plus encore. Utilisez le menu à gauche pour naviguer à travers les différentes fonctionnalités de votre tableau de bord.
          </p>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Astuces et conseils</h2>
            <ul className="list-disc list-inside space-y-3">
              <li>Ajoutez régulièrement de nouveaux produits pour enrichir votre catalogue.</li>
              <li>Consultez l'historique des commandes pour suivre vos ventes et améliorer votre service client.</li>
              <li>Utilisez la barre de navigation pour accéder rapidement aux différentes sections de l'application.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
