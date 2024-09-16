// OrderHistory.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/orders');
        setOrders(response.data);
      } catch (error) {
        setError('Erreur lors de la récupération des commandes');
        console.error('Erreur lors de la récupération des commandes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Historique des Commandes</h2>

      {loading && <p>Chargement des commandes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {orders.length > 0 ? (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order._id} className="border p-4 rounded-lg">
              <h3 className="text-xl font-semibold">Commande #{order._id}</h3>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Montant Total: €{order.totalAmount.toFixed(2)}</p>
              
              <h4 className="font-semibold mt-2">Adresse de Livraison:</h4>
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}</p>
              <p>{order.shippingAddress.postalCode}</p>

              <h4 className="font-semibold mt-4">Articles:</h4>
              <ul>
                {order.items.map(item => (
                  <li key={item.productId} className="border-b py-2">
                    <p>Produit: {item.productId.name} (ID: {item.productId._id})</p>
                    <p>Quantité: {item.quantity}</p>
                    <p>Prix: €{item.price.toFixed(2)}</p>
                    <p>Couleur: {item.color}</p>
                    <p>Taille: {item.size}</p>

                    {item.customizationOptions.length > 0 && (
                      <div>
                        <h5 className="font-semibold mt-2">Options de Personnalisation:</h5>
                        <ul>
                          {item.customizationOptions.map((option, index) => (
                            <li key={index} className="border-t py-1">
                              <p>Position: {option.position}</p>
                              <p>Tailles de Personnalisation: {option.customizationSize}</p>
                              {option.imageUrl && <img src={option.imageUrl} alt={`Personnalisation ${index}`} className="w-20 h-20 object-cover mt-2" />}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune commande trouvée.</p>
      )}
    </div>
  );
};

export default OrderHistory;
