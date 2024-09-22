import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import axios from 'axios';
import Pagination from '../components/Pagination';
import ConfirmationModal from '../modals/ConfirmationModal';
import EditCategoryModal from '../modals/EditCategoryModal';
import AddCategoryModal from '../modals/AddCategoryModal';
import DataTable from '../components/DataTable';
import { useAlert } from '../context/AlertContext';
import { AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai';
import { BiLoaderCircle } from 'react-icons/bi';
import { MdDelete, MdEdit } from "react-icons/md";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMultiDeleteModalOpen, setIsMultiDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const categoriesPerPage = 15;
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category`);
  
      if (Array.isArray(response.data)) {
        setCategories(response.data);
        setTotalPages(Math.ceil(response.data.length / categoriesPerPage));
      } else {
        console.error("Structure de réponse incorrecte :", response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * categoriesPerPage;
    const endIndex = startIndex + categoriesPerPage;
    const paginatedCategories = categories.slice(startIndex, endIndex);
    setFilteredCategories(paginatedCategories);
  }, [categories, currentPage]); 
  
  useEffect(() => {
  }, [categories]);
  
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  // Fonction pour ajouter une catégorie
  const handleAddCategory = async (newCategory) => {
    try {
      const response = await axios.post(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category`, newCategory);
      setCategories((prevCategories) => [...prevCategories, response.data]);
      setIsAddModalOpen(false);
      showAlert('Catégorie ajoutée avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      showAlert('Erreur lors de l\'ajout de la catégorie', 'error');
    }
  };

  // Fonction pour éditer une catégorie existante
  const handleEditCategory = async (updatedCategory) => {
    try {
      await axios.put(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category/${updatedCategory._id}`, updatedCategory);
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === updatedCategory._id ? updatedCategory : category
        )
      );
      setIsEditModalOpen(false);
      showAlert('Catégorie mise à jour avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      showAlert('Erreur lors de la mise à jour de la catégorie', 'error');
    }
  };

  // Fonction pour supprimer une catégorie
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category/${categoryToDelete}`);
      const updatedCategories = categories.filter((category) => category._id !== categoryToDelete);
      
      setCategories(updatedCategories);

      if ((updatedCategories.length <= (currentPage - 1) * categoriesPerPage) && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setFilteredCategories(updatedCategories.slice((currentPage - 1) * categoriesPerPage, currentPage * categoriesPerPage));
      }

      setIsConfirmationModalOpen(false);
      showAlert('Catégories supprimée avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      showAlert('Erreur lors de la suppression des catégorie', 'error');
    }
  };

  // Fonction pour supprimer plusieurs catégories
  const handleMultiDelete = async () => {
    try {
      await axios.delete(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category`, {
        data: { ids: selectedCategories },
      });

      const updatedCategories = categories.filter((category) => !selectedCategories.includes(category._id));
      setCategories(updatedCategories);

      if ((updatedCategories.length <= (currentPage - 1) * categoriesPerPage) && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setFilteredCategories(updatedCategories.slice((currentPage - 1) * categoriesPerPage, currentPage * categoriesPerPage));
      }

      setSelectedCategories([]);
      setIsMultiDeleteModalOpen(false);
      showAlert('Catégories supprimées avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression de plusieurs catégories:', error);
      showAlert('Erreur lors de la suppression de la catégorie', 'error');
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = categories.filter((category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCategories(filtered);
        setTotalPages(Math.ceil(filtered.length / categoriesPerPage)); 
        setCurrentPage(1);
      } else {
        const startIndex = (currentPage - 1) * categoriesPerPage;
        const endIndex = startIndex + categoriesPerPage;
        setFilteredCategories(categories.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(categories.length / categoriesPerPage)); 
      }
    }, 300);
  
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, categories, currentPage]);
  
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedCategories = [...filteredCategories].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredCategories(sortedCategories);
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map((category) => category._id));
    }
  };

  const handleCheckboxChange = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
          onChange={handleSelectAll}
        />
      ),
      accessor: 'select',
      render: (category) => (
        <input
          type="checkbox"
          checked={selectedCategories.includes(category._id)}
          onChange={() => handleCheckboxChange(category._id)}
        />
      ),
    },
    {
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
          Nom de la catégorie
        </div>
      ),
      accessor: 'name',
      sortable: true,
      render: (category) => category.name.charAt(0).toUpperCase() + category.name.slice(1),
    },
  ];

  const actions = [
    {
      label: 'Éditer',
      onClick: (category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
      },
      render: () => (
        <MdEdit className="text-yellow-500 hover:text-yellow-700 cursor-pointer" />
      ),
    },
    {
      label: 'Supprimer',
      onClick: (category) => {
        setCategoryToDelete(category._id);
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
          <h2 className="text-xl md:text-2xl font-bold">Catégories ({filteredCategories.length})</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 shadow-md"
            >
              <AiOutlinePlus className="mr-2" />
              Ajouter une catégorie
            </button>
            {selectedCategories.length > 0 && (
              <button
                onClick={() => setIsMultiDeleteModalOpen(true)}
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
            placeholder="Rechercher une catégorie par nom"
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
              data={filteredCategories}
              actions={actions}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
  
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditCategory}
          category={selectedCategory}
        />
  
        <AddCategoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddCategory}
        />
  
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={handleDelete}
          message="Êtes-vous sûr de vouloir supprimer cette catégorie ?"
        />
  
        <ConfirmationModal
          isOpen={isMultiDeleteModalOpen}
          onClose={() => setIsMultiDeleteModalOpen(false)}
          onConfirm={handleMultiDelete}
          message={`Êtes-vous sûr de vouloir supprimer ${selectedCategories.length} catégories ?`}
        />
      </div>
    </div>
  );
};  

export default Categories;
