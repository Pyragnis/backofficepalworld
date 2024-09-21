import React from 'react';
import Sidebar from '../components/sidebar';
import UpdProduct from '../components/UpdProduct';

const UpdateProduct = () => {
  return (
    <div className="flex">
      {/* Sidebar - ajustée à une largeur plus petite */}
      <div className="w-60">
        <Sidebar />
      </div>

      {/* Formulaire - occupe l'espace restant */}
      <div className="flex-1 p-6">
        <UpdProduct />
      </div>
    </div>
  );
};

export default UpdateProduct;