import React from 'react';
import { AiOutlineClose } from 'react-icons/ai'; // Icône pour le bouton de fermeture

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const orderNumber = order._id.substring(0, 8);
  const user = order.userId; // Récupérer les informations de l'utilisateur

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
        {/* Bouton de fermeture en haut à droite */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-300"
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Titre du modal */}
        <h2 className="text-2xl font-bold mb-4 text-center text-sky-600">
          Détails de la commande #{orderNumber}
        </h2>

        {/* Informations générales de la commande */}
        <div className="mb-6">
          <p className="mb-1"><strong>Date de commande :</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p className="mb-1"><strong>Montant total :</strong> <span className="text-green-600">€{order.totalAmount.toFixed(2)}</span></p>
        </div>

        {/* Informations de l'utilisateur */}
        {user && (
          <div className="mb-6 bg-gray-50 p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold text-sky-600 mb-2">Informations de l'utilisateur :</h3>
            <p className="mb-1"><strong>Nom :</strong> {user.firstName} {user.lastName}</p>
            <p className="mb-1"><strong>Email :</strong> {user.email}</p>
          </div>
        )}

        {/* Détails des articles commandés */}
        <h3 className="mt-4 mb-2 text-lg font-semibold text-sky-600">Articles commandés :</h3>
        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
          <ul className="space-y-4">
            {order.items.map((item, index) => (
              <li key={index} className="p-3 bg-white rounded-md shadow-sm">
                <div className="mb-2">
                  <p className="font-semibold text-gray-800">
                    <span className="text-sky-600">Produit :</span> {item.isTokenPurchase ? "Pack de tokens" : (item.productId?.name || "Produit non disponible")}
                  </p>
                  <p><strong>Quantité :</strong> {item.isTokenPurchase ? item.tokensQuantity : item.quantity}</p>
                  {!item.isTokenPurchase && (
                    <>
                      <p><strong>Couleur :</strong> {item.color || 'N/A'}</p>
                      <p><strong>Taille :</strong> {item.size || 'N/A'}</p>
                      <p><strong>Prix unitaire :</strong> €{item.price.toFixed(2)}</p>
                    </>
                  )}
                </div>

                {/* Détails des options de personnalisation */}
                {item.customizationOptions && item.customizationOptions.length > 0 && (
                  <div className="mt-2 p-2 bg-gray-100 rounded-md">
                    <h4 className="font-semibold text-sky-600 mb-2">Options de personnalisation :</h4>
                    <ul className="ml-4 mt-1 list-none">
                      {item.customizationOptions.map((option, idx) => (
                        <li key={idx} className="mb-2">
                          <p><strong>Position :</strong> {option.position}</p>
                          <p><strong>Taille de la personnalisation :</strong> {option.customizationSize}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Bouton de fermeture */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
