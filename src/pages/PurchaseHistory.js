import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';
import DataTable from '../components/DataTable';
import OrderDetailsModal from '../modals/OrderDetailsModal';
import Sidebar from '../components/sidebar'; 
import { AiOutlineSearch } from 'react-icons/ai';
import { BiLoaderCircle } from 'react-icons/bi';

const PurchaseHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'asc' });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      setError('Erreur lors de la récupération des commandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Gestion de la recherche
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        const results = orders.filter(order => order._id.toLowerCase().includes(searchQuery.toLowerCase()));
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, orders]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = React.useMemo(() => {
    let sortableOrders = searchResults.length > 0 ? [...searchResults] : [...orders];
    if (sortConfig.key) {
      sortableOrders.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrders;
  }, [orders, searchResults, sortConfig]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(orders.length / ordersPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const columns = [
    {
      header: 'N° de Commande',
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
      sortable: false,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-60">
        <Sidebar />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-6 bg-gray-100">
        <h2 className="text-3xl font-bold mb-6">Historique des commandes</h2>

        {/* Affichage du nombre total de commandes */}
        <div className="bg-gray-100 p-4 rounded-md shadow-sm mb-4">
          <p className="text-gray-700 text-lg">Nombre total de commandes : <strong>{orders.length}</strong></p>
        </div>

        {/* Champ de recherche */}
        <div className="flex mb-4">
          <div className="relative flex items-center w-full">
            <AiOutlineSearch className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par ID de commande"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border rounded-lg pl-10 py-2 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <BiLoaderCircle className="animate-spin text-3xl text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-4">
            <DataTable
              columns={columns}
              data={currentOrders}
              actions={[
                {
                  label: 'Voir détails',
                  onClick: (order) => setSelectedOrder(order),
                  render: () => (
                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-200 text-sm">
                      Voir détails
                    </button>
                  ),
                },
              ]}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil((searchResults.length > 0 ? searchResults.length : orders.length) / ordersPerPage)}
              onPageChange={handlePageChange}
            />
            <OrderDetailsModal
              isOpen={!!selectedOrder}
              onClose={() => setSelectedOrder(null)}
              order={selectedOrder}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
