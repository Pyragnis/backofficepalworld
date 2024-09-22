import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import axios from 'axios';

const Dashboard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchCounts = async () => {
    try {
      // Récupérer le nombre de commandes
      const ordersResponse = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/orders/count`);
      setTotalOrders(ordersResponse.data.count);

      // Récupérer le nombre d'utilisateurs
      const usersResponse = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/users/count`);
      setTotalUsers(usersResponse.data.count);

      // Récupérer le nombre de catégories
      const categoriesResponse = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category/count`);
      setTotalCategories(categoriesResponse.data.count);

      // Récupérer le nombre de produtis
      const productsResponse = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/products/count`);
      setTotalProducts(productsResponse.data.count);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

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

        <section className="max-w-4xl mx-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">Total utilisateurs</h2>
              <p className="text-3xl font-bold text-green-600">{totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">Total commandes</h2>
              <p className="text-3xl font-bold text-sky-600">{totalOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">Total catégories</h2>
              <p className="text-3xl font-bold text-yellow-600">{totalCategories}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">Total produits</h2>
              <p className="text-3xl font-bold text-red-600">{totalProducts}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
