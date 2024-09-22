import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import Pagination from '../../components/Pagination';
import DataTable from '../../components/DataTable';
import ConfirmationModal from '../../modals/ConfirmationModal';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { BiLoaderCircle } from 'react-icons/bi';
import { MdDelete, MdEdit } from "react-icons/md";

const ListProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 7;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' }); 
  const productCache = useRef({});

  const fetchProducts = async (page = 1) => {
    if (productCache.current[`${page}`]) {
      const cachedData = productCache.current[`${page}`];
      setProducts(cachedData.products);
      setFilteredProducts(cachedData.products); 
      setTotalPages(cachedData.totalPages);
      setCurrentPage(cachedData.currentPage);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/products`, {
        params: { page, limit: productsPerPage },
      });
      
      productCache.current[`${page}`] = response.data;
      setProducts(response.data.products || []);
      setFilteredProducts(response.data.products || []); 
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category`);
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
    fetchCategories();
  }, [currentPage]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(products);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, products]);

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
      setIsConfirmationModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    }
  };

  const handleMultiDelete = async () => {
    try {
      await axios.delete(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/products`, {
        data: { ids: selectedProducts }
      });
      setProducts((prevProducts) => prevProducts.filter((product) => !selectedProducts.includes(product._id)));
      setSelectedProducts([]);
      setIsConfirmationModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de plusieurs produits:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/update-product/${id}`);
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) => 
      prevSelected.includes(productId) 
        ? prevSelected.filter(id => id !== productId) 
        : [...prevSelected, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((product) => product._id));
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = React.useMemo(() => {
    let sortableProducts = [...filteredProducts];
    if (sortConfig.key) {
      sortableProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  }, [filteredProducts, sortConfig]);

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
          onChange={handleSelectAll}
        />
      ),
      accessor: 'select',
      render: (product) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(product._id)}
          onChange={() => handleCheckboxChange(product._id)}
        />
      ),
    },
    {
      header: 'Image',
      accessor: 'image',
      render: (product) => (
        <img
          src={product.images[0] || 'comingsoon.jpg'}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-md"
        />
      ),
    },
    {
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
          Nom du produit
        </div>
      ),
      accessor: 'name',
      sortable: true,
    },
    {
      header: 'Catégorie',
      accessor: 'category',
      render: (product) => {
        if (product.category && product.category.length > 0) {
          const categoryNames = product.category
            .map(cat => cat.name.charAt(0).toUpperCase() + cat.name.slice(1))
            .join(', ');
          return categoryNames || 'N/A';
        }
        return 'N/A';
      },
    },
    {
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort('price')}>
          Prix (€)
        </div>
      ),
      accessor: 'price',
      sortable: true,
      render: (product) => (product.discountPrice || product.price).toFixed(2),
    },
    {
      header: 'Prix Ancien (€)',
      accessor: 'oldPrice',
      render: (product) => (product.discountPrice ? product.price.toFixed(2) : 'N/A'),
    }, 
  ];

  const actions = [
    {
      label: 'Éditer',
      onClick: (product) => handleEdit(product._id),
      render: () => (
        <MdEdit className="text-yellow-500 hover:text-yellow-700 cursor-pointer" />
      ),
    },
    {
      label: 'Supprimer',
      onClick: (product) => {
        setProductToDelete(product._id);
        setIsConfirmationModalOpen(true);
      },
      render: () => (
        <MdDelete className="text-red-500 hover:text-red-700 cursor-pointer" />
      ),
    },
  ];

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-60">
        <Sidebar />
      </div>
      <div className="flex-1 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Produits ({filteredProducts.length})</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/add-product')}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 shadow-md"
            >
              <AiOutlinePlus className="mr-2" />
              Ajouter un produit
            </button>
            {selectedProducts.length > 0 && (
              <button
                onClick={() => setIsConfirmationModalOpen(true)}
                className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 shadow-md"
              >
                Supprimer la sélection
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center border rounded-md p-2 bg-white shadow-sm">
          <AiOutlineSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Rechercher un produit par nom"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-1 outline-none"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <BiLoaderCircle className="animate-spin text-3xl text-blue-500" />
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={sortedProducts}
              actions={actions}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}

        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={() => productToDelete ? handleDelete(productToDelete) : handleMultiDelete()}
          message={`Êtes-vous sûr de vouloir supprimer ${productToDelete ? "ce produit" : selectedProducts.length + " produits"} ?`}
        />
      </div>
    </div>
  );
};

export default ListProduct;
