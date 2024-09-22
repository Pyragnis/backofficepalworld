import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import ProductList from '../../components/Products/ProductList';

const ListProduct = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 8;
  const productCache = useRef({});

  const fetchProducts = async (page = 1) => {
    // Vérification du cache avant l'appel de l'API
    if (productCache.current[`${category}-${page}`]) {
      const cachedData = productCache.current[`${category}-${page}`];
      setProducts(cachedData.products);
      setTotalPages(cachedData.totalPages);
      setCurrentPage(cachedData.currentPage);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/products`, {
        params: { category, page, limit: productsPerPage },
      });
      
      productCache.current[`${category}-${page}`] = response.data;
      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [category, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/products/${id}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));

      if (products.length === 1 && currentPage > 1) {
        handlePageChange(currentPage - 1);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/update-product/${id}`);
  };

  return (
    <div className="flex">
      <div className="w-60">
        <Sidebar />
      </div>
      <div className="flex-1 p-6">
        {loading ? (
          <p>Chargement des produits...</p>
        ) : (
          <ProductList
            products={products}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
};

export default ListProduct;
