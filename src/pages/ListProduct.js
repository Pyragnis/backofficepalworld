import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import axios from 'axios';
import ProductList from '../components/ProductList';

const ListProduct = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 8;
  const productCache = useRef({}); // Utilisation d'un cache pour les produits

  // Fonction pour récupérer les produits
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
      
      // Mise en cache des données de la page actuelle
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

  // Optimisation avec useEffect pour récupérer les produits lorsque la catégorie ou la page change
  useEffect(() => {
    fetchProducts(currentPage);
  }, [category, currentPage]);

  // Gestion du changement de page
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Fonction de suppression du produit
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/products/${id}`);
      // Rafraîchir la liste des produits après suppression
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
      
      // Rafraîchir la page si aucun produit n'est disponible sur la page actuelle
      if (products.length === 1 && currentPage > 1) {
        handlePageChange(currentPage - 1);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    }
  };

  // Fonction d'édition du produit
  const handleEdit = (id) => {
    navigate(`/UpdateProduct/${id}`);
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
