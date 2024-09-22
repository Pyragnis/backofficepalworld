import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';
import Pagination from '../../components/Pagination';

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

    const debounceTimeout = setTimeout(fetchSearchedProducts, 500);

    return () => clearTimeout(debounceTimeout);
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

      {/* Pagination améliorée */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ProductList;
