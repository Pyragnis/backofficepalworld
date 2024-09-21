import React from 'react';
import Sidebar from '../../components/sidebar';
import UpdProduct from '../../components/Forms/UpdProductForm';

const UpdateProduct = () => {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Sidebar - ajustée à une largeur plus petite */}
      <div className="w-full lg:w-1/6">
        <Sidebar />
      </div>

      {/* Formulaire - occupe l'espace restant */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 xl:p-12 overflow-y-auto">
        <UpdProduct />
      </div>
    </div>
  );
};

export default UpdateProduct;