import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, image, title, price, onDelete, onEdit }) => {
  
  return (
    <div className="border rounded-lg p-4 shadow-lg transform transition-transform duration-300 hover:scale-95 hover:shadow-xl">
      <Link to={`/product/${id}`}>
        <div className="aspect-w-4 aspect-h-3 mb-4">
          <img src={image} alt={title} className="w-full h-full object-contain rounded" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">€{price}</p>
      </Link>
      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => onEdit(id)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
        >
          Éditer
        </button>
        <button
          onClick={() => onDelete(id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
