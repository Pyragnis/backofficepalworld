import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';

const ProductList = ({ products, currentPage, totalPages, onPageChange, onDelete, onEdit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const fetchSearchedProducts = async () => {
      try {
        if (searchQuery.length >= 2) {
          const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/search?query=${searchQuery}`);
          setFilteredProducts(response.data);
        } else {
          setFilteredProducts(products);
        }
      } catch (error) {
        console.error('Erreur lors de la recherche des produits :', error);
      }
    };

    fetchSearchedProducts();
  }, [searchQuery, products]);

  return (
    <div className="px-4">
      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un produit par nom"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Grille des produits */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              image={product.images[0] || 'comingsoon.jpg'}
              title={product.name}
              price={product.discountPrice ? product.discountPrice : product.price}
              oldPrice={product.discountPrice ? product.price : null}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        ) : (
          <p>Aucun produit disponible dans cette catégorie.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
          >
            Précédent
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => onPageChange(index + 1)}
              className={`px-4 py-2 mx-1 border rounded-lg ${
                index + 1 === currentPage ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'
              } hover:bg-sky-500 hover:text-white transition-colors duration-300`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
