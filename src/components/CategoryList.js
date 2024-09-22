import React, { useState } from 'react';
import ConfirmationModal from '../modals/ConfirmationModal';
import EditCategoryModal from '../modals/EditCategoryModal';
import Pagination from './Pagination';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const CategoryList = ({ categories, onDelete, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 12;

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      onDelete(selectedCategory._id);

      if (currentCategories.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
    setIsModalOpen(false);
  };

  const handleSaveEdit = (updatedCategory) => {
    onEdit(updatedCategory); 
    setIsEditModalOpen(false);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left border-b font-semibold">Nom de la Catégorie</th>
            <th className="py-3 px-4 text-left border-b font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.length > 0 ? (
            currentCategories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-100 transition duration-200">
                <td className="py-2 px-4 border-b">{capitalizeFirstLetter(category.name)}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEditClick(category)}
                    className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700 transition duration-300 mr-2"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center py-4 text-gray-500">Aucune catégorie trouvée.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`Êtes-vous sûr de vouloir supprimer la catégorie "${selectedCategory?.name}" ?`}
      />

      {/* Modal d'édition de la catégorie */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        category={selectedCategory}
      />
    </div>
  );
};

export default CategoryList;
