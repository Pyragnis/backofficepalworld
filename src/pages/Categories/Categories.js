import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import Pagination from '../../components/Pagination';
import ConfirmationModal from '../../modals/ConfirmationModal';
import EditCategoryModal from '../../modals/EditCategoryModal';
import AddCategoryModal from '../../modals/AddCategoryModal';
import { AiOutlineSearch, AiOutlinePlus, AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { BiLoaderCircle } from 'react-icons/bi';
import { MdDelete, MdEdit } from "react-icons/md";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  // Multi-selection state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMultiDeleteModalOpen, setIsMultiDeleteModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 15;
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category`);
      setCategories(response.data);
      setFilteredCategories(response.data); // Initialiser filteredCategories avec toutes les catégories
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    } finally {
      setLoading(false);
    }
  };  

  const showAlert = (message, type = 'success') => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 px-4 py-2 rounded shadow-lg transition duration-300 ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`;
    alertDiv.innerText = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      setTimeout(() => document.body.removeChild(alertDiv), 300);
    }, 3000);
  };

  const handleAddCategory = async (newCategory) => {
    try {
      const response = await axios.post(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category`, {
        name: newCategory.name,
      });
      setCategories((prevCategories) => [...prevCategories, response.data]);
      setFilteredCategories((prevCategories) => [...prevCategories, response.data]);
      setIsAddModalOpen(false);
      showAlert('Catégorie ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      showAlert('Erreur lors de l\'ajout de la catégorie', 'error');
    }
  };

  const handleEditCategory = async (updatedCategory) => {
    try {
      await axios.put(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category/${updatedCategory._id}`, {
        name: updatedCategory.name,
      });
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === updatedCategory._id ? { ...category, name: updatedCategory.name } : category
        )
      );
      setFilteredCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === updatedCategory._id ? { ...category, name: updatedCategory.name } : category
        )
      );
      setIsEditModalOpen(false);
      showAlert('Catégorie mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      showAlert('Erreur lors de la mise à jour de la catégorie', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category/${categoryToDelete}`);
      setCategories((prevCategories) => prevCategories.filter((category) => category._id !== categoryToDelete));
      setFilteredCategories((prevCategories) => prevCategories.filter((category) => category._id !== categoryToDelete));
      setIsConfirmationModalOpen(false);
      showAlert('Catégorie supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      showAlert('Erreur lors de la suppression de la catégorie', 'error');
    }
  };

  const handleMultiDelete = async () => {
    try {
      await axios.delete(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category`, {
        data: { ids: selectedCategories }
      });
      setCategories((prevCategories) => prevCategories.filter((category) => !selectedCategories.includes(category._id)));
      setFilteredCategories((prevCategories) => prevCategories.filter((category) => !selectedCategories.includes(category._id)));
      setSelectedCategories([]); // Réinitialiser la sélection
      setIsMultiDeleteModalOpen(false);
      showAlert('Catégories supprimées avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de plusieurs catégories:', error);
      showAlert('Erreur lors de la suppression de plusieurs catégories', 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = categories.filter((category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCategories(filtered);
      } else {
        setFilteredCategories(categories);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, categories]);

  // Sorting logic
  const handleSort = () => {
    let direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: 'name', direction });
    
    const sortedCategories = [...filteredCategories].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return direction === 'asc' ? -1 : 1;
      if (nameA > nameB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredCategories(sortedCategories);
  };

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Function to capitalize the first letter of the category name
  const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1);

  // Gestion de la sélection multiple
  const handleCheckboxChange = (categoryId) => {
    setSelectedCategories((prevSelected) => 
      prevSelected.includes(categoryId) 
        ? prevSelected.filter(id => id !== categoryId) 
        : [...prevSelected, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === currentCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(currentCategories.map((category) => category._id));
    }
  };

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
                <MdDelete className="mr-2" />
                Supprimer la sélection
              </button>
            )}
          </div>
        </div>

        {/* Barre de recherche */}
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
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-3 px-2 md:px-4 border-b text-left">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedCategories.length === currentCategories.length && currentCategories.length > 0}
                    />
                  </th>
                  <th
                    className="py-3 px-2 md:px-4 text-left border-b font-semibold cursor-pointer"
                    onClick={handleSort}
                  >
                    Nom de la catégorie
                    {sortConfig.direction === 'asc' ? (
                      <AiOutlineArrowUp className="inline ml-1" />
                    ) : (
                      <AiOutlineArrowDown className="inline ml-1" />
                    )}
                  </th>
                  <th className="py-3 px-2 md:px-4 text-left border-b font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.length > 0 ? (
                  currentCategories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-100 transition duration-200">
                      <td className="py-2 px-2 md:px-4 border-b">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => handleCheckboxChange(category._id)}
                        />
                      </td>
                      <td className="py-2 px-2 md:px-4 border-b">{capitalize(category.name)}</td>
                      <td className="py-2 px-2 md:px-4 border-b">
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsEditModalOpen(true);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300 text-sm mr-2"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => {
                            setCategoryToDelete(category._id);
                            setIsConfirmationModalOpen(true);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300 text-sm"
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">Aucune catégorie trouvée.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
          </div>
        )}

        {/* Modal d'édition de la catégorie */}
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditCategory}
          category={selectedCategory}
        />

        {/* Modal d'ajout de la catégorie */}
        <AddCategoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddCategory}
        />

        {/* Modal de confirmation pour la suppression */}
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={handleDelete}
          message="Êtes-vous sûr de vouloir supprimer cette catégorie ?"
        />

        {/* Modal de confirmation pour la suppression multiple */}
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
