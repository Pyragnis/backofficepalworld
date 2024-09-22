import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import OrderDetailsModal from '../../modals/OrderDetailsModal';
import Pagination from '../../components/Pagination';

const UserOrders = () => {
  const { userId } = useParams(); 
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 12;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/orders/${userId}`); 
      setOrders(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
    }
  };

  useEffect(() => {
    fetchUserOrders();
    fetchUserInfo();
  }, [userId]);

  // Débouncer pour la recherche
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        const results = orders.filter(order => order._id.toLowerCase().includes(searchQuery.toLowerCase()));
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300); // Attendre 300 ms avant d'effectuer la recherche

    return () => clearTimeout(delayDebounceFn); // Nettoyage du délai lorsque le composant est démonté ou que la recherche change
  }, [searchQuery, orders]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const resetSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = searchResults.length > 0 ? searchResults : orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-60">
        <Sidebar />
      </div>
      <div className="flex-1 p-4 md:p-6">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center text-white rounded-lg bg-sky-600 px-4 py-2 hover:font-semibold mb-4"
        >
          <span className="mr-2 text-lg">&#8592;</span>
          Retour à la liste des utilisateurs
        </button>

        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Liste des commandes de {user ? `${user.fullName || user.firstName } (${user.email})` : ''}
        </h2>

        {/* Champ de recherche */}
        <div className="flex flex-col md:flex-row mb-4">
          <input
            type="text"
            placeholder="Rechercher par ID de commande"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-4 py-2 rounded-lg flex-grow mb-2 md:mb-0 md:mr-2"
          />
          <div className="flex">
            <button onClick={resetSearch} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg w-full md:w-auto">
              Réinitialiser
            </button>
          </div>
        </div>

        {loading ? (
          <p>Chargement des commandes...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-2 md:px-4 text-left border-b font-semibold">N° de commande</th>
                  <th className="py-3 px-2 md:px-4 text-left border-b font-semibold">Date</th>
                  <th className="py-3 px-2 md:px-4 text-left border-b font-semibold">Montant total</th>
                  <th className="py-3 px-2 md:px-4 text-left border-b font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-100 transition duration-200">
                      <td className="py-2 px-2 md:px-4 border-b">#{order._id.substring(0, 8)}</td>
                      <td className="py-2 px-2 md:px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 px-2 md:px-4 border-b">{order.totalAmount} €</td>
                      <td className="py-2 px-2 md:px-4 border-b">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-300 text-xs md:text-sm"
                        >
                          Voir détails
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">Aucune commande trouvée.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        <OrderDetailsModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
        />
      </div>
    </div>
  );
};

export default UserOrders;
