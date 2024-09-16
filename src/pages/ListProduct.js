import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import axios from 'axios';
import ProductList from '../components/ProductList';

const ListProduct = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 1024);

  const productsPerPage = 8;

  const fetchProducts = async (page = 1) => {
    try {
      const response = await axios.get('http://localhost:3005/api/products', {
        params: { ...filters, category, page, limit: productsPerPage }
      });
      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [filters, category, currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to the first page when applying filters
    setIsFilterModalOpen(false); // Close modal after applying filters
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3005/api/products/${id}`);
      setProducts(products.filter(product => product._id !== id)); // Remove deleted product from state
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/UpdateProduct/${id}`);
  };


  useEffect(() => {
    const handleResize = () => {
      setIsScreenSmall(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsFilterModalOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
