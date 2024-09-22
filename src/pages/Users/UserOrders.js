import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import OrderDetailsModal from '../../modals/OrderDetailsModal';
import Pagination from '../../components/Pagination';
import { AiOutlineSearch, AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineArrowLeft } from 'react-icons/ai';
import { BiLoaderCircle } from 'react-icons/bi';

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
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'asc' }); // Ajout de l'état de tri

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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        const results = orders.filter(order => order._id.toLowerCase().includes(searchQuery.toLowerCase()));
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, orders]);

  // Gestion du tri par date
  const handleSort = () => {
    const direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: 'createdAt', direction });

    const sortedOrders = [...orders].sort((a, b) => {
      if (direction === 'asc') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    setOrders(sortedOrders);
  };

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
          className="flex items-center text-white rounded-lg bg-indigo-600 px-4 py-2 hover:bg-indigo-700 transition duration-300 mb-4 shadow-md"
        >
          <AiOutlineArrowLeft className="mr-2" size={20} />
          Retour à la liste des utilisateurs
        </button>

        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Commandes de {user ? `${user.fullName || user.firstName} (${user.email})` : ''}
        </h2>

        {/* Statistiques des commandes */}
        <div className="mb-4 bg-gray-100 p-4 rounded-md shadow-sm">
          <p className="text-gray-700">
            Nombre total de commandes : <strong>{orders.length}</strong>
          </p>
          <p className="text-gray-700">
            Montant total : <strong>{orders.reduce((acc, order) => acc + order.totalAmount, 0).toFixed(2)} €</strong>
          </p>
        </div>

        {/* Champ de recherche */}
        <div className="flex items-center border rounded-lg p-2 mb-4 bg-white shadow-sm">
          <AiOutlineSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Rechercher par ID de commande"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-1 outline-none"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <BiLoaderCircle className="animate-spin text-3xl text-blue-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-3 px-2 md:px-4 text-left border-b font-semibold">N° de commande</th>
                  <th 
                    className="py-3 px-2 md:px-4 text-left border-b font-semibold cursor-pointer flex items-center"
                    onClick={handleSort}
                  >
                    Date
                    {sortConfig.direction === 'asc' ? (
                      <AiOutlineArrowUp className="ml-1" />
                    ) : (
                      <AiOutlineArrowDown className="ml-1" />
                    )}
                  </th>
                  <th className="py-3 px-2 md:px-4 text-left border-b font-semibold">Montant total</th>
                  <th className="py-3 px-2 md:px-4 text-left border-b font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-blue-50 transition duration-200">
                      <td className="py-2 px-2 md:px-4 border-b">#{order._id.substring(0, 8)}</td>
                      <td className="py-2 px-2 md:px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 px-2 md:px-4 border-b font-semibold">{order.totalAmount} €</td>
                      <td className="py-2 px-2 md:px-4 border-b">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300 text-sm"
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
