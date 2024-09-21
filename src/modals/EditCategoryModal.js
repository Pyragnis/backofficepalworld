import React, { useState, useEffect } from 'react';

const EditCategoryModal = ({ isOpen, onClose, onSave, category }) => {
  const [name, setName] = useState(category ? category.name : '');

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleSave = () => {
    if (name.trim()) {
      onSave({ ...category, name });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Modifier la Catégorie</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Nom de la catégorie :</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-sky-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition duration-300"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
