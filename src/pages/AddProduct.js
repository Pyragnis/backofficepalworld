import React from 'react';
import Sidebar from '../components/sidebar';
import AddProductForm from '../components/AddProductForm';

const AddProduct = () => {
  return (
    <div className="flex">
      {/* Sidebar - ajustée à une largeur plus petite */}
      <div className="w-60">
        <Sidebar />
      </div>

      {/* Formulaire - occupe l'espace restant */}
      <div className="flex-1 p-6">
        <AddProductForm />
      </div>
    </div>
  );
};

export default AddProduct;
