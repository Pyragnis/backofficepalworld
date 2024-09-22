import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../../components/Pagination';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;
  const [users, setUsers] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des informations utilisateur pour l'ID: ${userId}`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/orders`);
        const orders = response.data;
  
        const usersInfo = {};
        for (const order of orders) {
          const userId = typeof order.userId === 'object' ? order.userId._id : order.userId;
          if (userId && !usersInfo[userId]) {
            const userInfo = await fetchUserInfo(userId);
            usersInfo[userId] = userInfo;
          }
        }
  
        setUsers(usersInfo);
        setOrders(orders);
      } catch (error) {
        setError('Erreur lors de la récupération des commandes');
        console.error('Erreur lors de la récupération des commandes:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);

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

  const handleSearch = async () => {
    if (searchQuery.length < 2) {
      alert('Veuillez entrer au moins 2 caractères pour effectuer une recherche.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/search?query=${searchQuery}`);
      setSearchResults([response.data]);
    } catch (error) {
      console.error('Erreur lors de la recherche de la commande:', error);
      setSearchResults([]);
    }
  };

  const resetSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const currentOrders = orders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Historique des commandes</h2>

      {/* Champ de recherche */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Rechercher par ID de commande"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        />
        <button onClick={handleSearch} className="ml-2 bg-sky-600 text-white px-4 py-2 rounded-lg">
          Rechercher
        </button>
        <button onClick={resetSearch} className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
          Réinitialiser
        </button>
      </div>

      {loading && <p>Chargement des commandes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Affichage des résultats de la recherche */}
      {searchResults.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Résultat de la recherche :</h3>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2 text-sky-600">Commande #{searchResults[0]._id.substring(0, 8)}</h3>
            <p>Date : {new Date(searchResults[0].createdAt).toLocaleDateString()}</p>
            <p>Montant Total : €{searchResults[0].totalAmount.toFixed(2)}</p>

            {/* Affichage des informations de l'utilisateur */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700">Informations sur l'utilisateur :</h4>
              {users[searchResults[0].userId] ? (
                <>
                  <p>Nom : {users[searchResults[0].userId].firstName} {users[searchResults[0].userId].lastName}</p>
                  <p>Email : {users[searchResults[0].userId].email}</p>
                  <p>Téléphone : {users[searchResults[0].userId].phone}</p>
                </>
              ) : (
                <p>Utilisateur inconnu</p>
              )}
            </div>

            {/* Affichage de l'adresse de livraison si ce n'est pas un achat via tokens */}
            {!searchResults[0].items.some(item => item.isTokenPurchase) && searchResults[0].shippingAddress && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700">Adresse de livraison :</h4>
                <p>{searchResults[0].shippingAddress.name}</p>
                <p>{searchResults[0].shippingAddress.street}</p>
                <p>{searchResults[0].shippingAddress.city}</p>
                <p>{searchResults[0].shippingAddress.postalCode}</p>
              </div>
            )}

            {/* Affichage des articles de la commande */}
            <h4 className="font-semibold text-gray-700 mb-2">Articles :</h4>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {searchResults[0].items.map((item) => (
                <li key={item.productId?._id || item._id} className="bg-gray-100 rounded-md p-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{item.productId?.name || 'Produit acheté'}</p>
                      <p>Quantité : {item.quantity}</p>
                      <p>Prix : €{item.price.toFixed(2)}</p>

                      {item.isTokenPurchase && (
                        <p className="text-green-500 font-semibold">
                          Pack de tokens achetés : {item.tokensQuantity} pack
                        </p>
                      )}
                      </div>

                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={`Produit ${item.productId?.name}`}
                          className="w-16 h-16 object-cover ml-4"
                        />
                      )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <>
          {/* Affichage des commandes paginées normales */}
          {currentOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentOrders.map((order) => (
                <div key={order._id} className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2 text-sky-600">Commande #{order._id.substring(0, 8)}</h3>
                  <p className="text-gray-500 mb-2">Date : {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="font-semibold text-lg mb-2">Montant total : €{order.totalAmount.toFixed(2)}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700">Informations sur l'utilisateur :</h4>
                    {users[order.userId._id || order.userId] ? (
                      <>
                        <p>Nom : {users[order.userId._id || order.userId].firstName} {users[order.userId._id || order.userId].lastName}</p>
                        <p>Email : {users[order.userId._id || order.userId].email}</p>
                        <p>Téléphone : {users[order.userId._id || order.userId].phone}</p>
                      </>
                    ) : (
                      <p>Utilisateur inconnu</p>
                    )}
                  </div>

                  {!order.items.some(item => item.isTokenPurchase) && order.shippingAddress && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700">Adresse de livraison :</h4>
                      <p>{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.city}</p>
                      <p>{order.shippingAddress.postalCode}</p>
                    </div>
                  )}

                  <h4 className="font-semibold text-gray-700 mb-2">Articles :</h4>
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {order.items.map((item) => (
                      <li key={item.productId?._id || item._id} className="bg-gray-100 rounded-md p-2">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold">{item.productId?.name || 'Tokens'}</p>
                            <p>Quantité : {item.quantity}</p>
                            <p>Prix : €{item.price.toFixed(2)}</p>

                            {!item.isTokenPurchase && (
                              <>
                                <p>Couleur : {item.color}</p>
                                <p>Taille : {item.size}</p>

                                {item.customizationOptions.length  > 0 && (
                                  <div className='border-t mt-2'>
                                  <h5 className="font-semibold mt-2">Options de personnalisation:</h5>
                                  <ul>
                                    {item.customizationOptions.map((option, index) => (
                                      <li key={index} className="py-1">
                                        <p>Position : {option.position}</p>
                                        <p>Tailles de personnalisation : {option.customizationSize}</p>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                )}
                              </>
                            )}

                            {item.isTokenPurchase && (
                              <p className="text-green-500 font-semibold">
                                Pack de tokens achetés : {item.tokensQuantity} pack
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>Aucune commande trouvée.</p>
          )}
        </>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default OrderHistory;
