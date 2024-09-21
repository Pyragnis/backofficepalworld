import React from 'react';
import Sidebar from '../../components/sidebar';
import AddProductForm from '../../components/Forms/AddProductForm';

const AddProduct = () => {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Sidebar */}
      <div className="w-full lg:w-1/6">
        <Sidebar />
      </div>

      {/* Formulaire */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 xl:p-12 overflow-y-auto">
        <AddProductForm />
      </div>
    </div>
  );
};

export default AddProduct;
