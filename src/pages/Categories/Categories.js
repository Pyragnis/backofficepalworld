import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import CategoryList from '../../components/CategoryList';
import EditCategoryModal from '../../modals/EditCategoryModal';
import AddCategoryModal from '../../modals/AddCategoryModal';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category`);
      setCategories(response.data);
      setFilteredCategories(response.data); 
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
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category/${id}`);
      setCategories((prevCategories) => prevCategories.filter((category) => category._id !== id));
      setFilteredCategories((prevCategories) => prevCategories.filter((category) => category._id !== id));
      showAlert('Catégorie supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      showAlert('Erreur lors de la suppression de la catégorie', 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, categories]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-60">
        <Sidebar />
      </div>
      <div className="flex-1 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Catégories</h2>
        </div>

        {/* Barre de recherche */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher une catégorie par nom"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 mb-4 w-full md:w-auto"
        >
          Ajouter une catégorie
        </button>

        {loading ? (
          <p>Chargement des catégories...</p>
        ) : (
          <CategoryList
            categories={filteredCategories}
            onDelete={handleDelete}
            onEdit={(category) => {
              setSelectedCategory(category);
              setIsEditModalOpen(true); 
            }}
          />
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
      </div>
    </div>
  );
};

export default Categories;
