import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, image, title, price, oldPrice, onDelete, onEdit }) => {
  return (
    <div className="border rounded-lg p-4 shadow-lg transform transition-transform duration-300 hover:scale-95 hover:shadow-xl">
      <Link to={`/product/${id}`}>
        <div className="aspect-w-4 aspect-h-3 mb-4">
          <img src={image} alt={title} className="w-full h-full object-cover rounded" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex items-center space-x-2">
          {oldPrice && (
            <p className="text-red-500 line-through">€{oldPrice}</p>
          )}
          <p className="text-black font-semibold">€{price}</p>
        </div>
      </Link>

      <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 mt-4">
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
