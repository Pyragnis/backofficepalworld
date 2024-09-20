import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, currentPage, totalPages, onPageChange, onDelete, onEdit }) => {

  return (
    <div className="px-4"> {/* Ajout de padding sur les côtés */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Augmenter la valeur de gap */}
        {products.length > 0 ? (
          products.map((product) => (
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
