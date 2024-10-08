import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import OrderDetailsModal from '../../modals/OrderDetailsModal';
import Pagination from '../../components/Pagination';
import DataTable from '../../components/DataTable';
import { AiOutlineSearch, AiOutlineArrowLeft } from 'react-icons/ai';
import { BiLoaderCircle } from 'react-icons/bi';

const UserOrders = () => {
  const { userId } = useParams(); 
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'asc' });

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

  const handleSort = (key) => {
    const direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedOrders = [...orders].sort((a, b) => {
      if (key === 'createdAt') {
        return direction === 'asc' ? new Date(a[key]) - new Date(b[key]) : new Date(b[key]) - new Date(a[key]);
      }
      return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
    });

    setOrders(sortedOrders);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = searchResults.length > 0 ? searchResults : orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const columns = [
    {
      header: 'N° de commande',
      accessor: '_id',
      render: (order) => `#${order._id.substring(0, 8)}`,
      sortable: false,
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (order) => new Date(order.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      header: 'Montant Total (€)',
      accessor: 'totalAmount',
      render: (order) => `€${order.totalAmount.toFixed(2)}`,
      sortable: true,
    },
  ];

  const actions = [
    {
      label: 'Voir détails',
      onClick: (order) => setSelectedOrder(order),
      render: () => (
        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-200 text-sm">
          Voir détails
        </button>
      ),
    },
  ];

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

        <div className="mb-4 bg-gray-100 p-4 rounded-md shadow-sm">
          <p className="text-gray-700">
            Nombre total de commandes : <strong>{orders.length}</strong>
          </p>
          <p className="text-gray-700">
            Montant total : <strong>{orders.reduce((acc, order) => acc + order.totalAmount, 0).toFixed(2)} €</strong>
          </p>
        </div>

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
          <div className="bg-white shadow-lg rounded-lg p-4">
            <DataTable
              columns={columns}
              data={currentOrders}
              actions={actions}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
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
