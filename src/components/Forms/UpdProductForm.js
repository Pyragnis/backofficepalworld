import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAlert } from '../../context/AlertContext';
import { useParams, useNavigate } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";

const UpdProduct = () => {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    characteristics: '',
    price: 0,
    discountPrice: 0,
    quantity: 0,
    category: '',
    images: [],
    colors: [],
    sizes: [],
    isPromo: false,
    customizationOptions: [{ 
      position: '', 
      customizationSize: [] 
    }],
  });;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category`);
        const formattedCategories = response.data.map(cat => ({
          ...cat,
          name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/products/${id}`);
          const product = response.data;
          setProductData(product);
        } catch (error) {
          console.error('Erreur lors de la récupération du produit:', error);
          setError('Erreur lors de la récupération des informations du produit.');
        }
      };

      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Gestion dynamique des catégories
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setProductData({ ...productData, category: [selectedCategoryId] });
  };

  const handleCustomSizeChange = (index, value) => {
    const updatedSizes = [...productData.sizes];
    updatedSizes[index] = value;
    setProductData({ ...productData, sizes: updatedSizes });
  };

  const handleAddCustomSize = () => {
    setProductData((prevData) => ({
      ...prevData,
      sizes: [...prevData.sizes, '']
    }));
  };

  const handleRemoveCustomSize = (index) => {
    const updatedSizes = [...productData.sizes];
    updatedSizes.splice(index, 1);
    setProductData({ ...productData, sizes: updatedSizes });
  };

  // Gestion dynamique des images
  const handleImageChange = (index, value) => {
    const updatedImages = [...productData.images];
    updatedImages[index] = value;
    setProductData({ ...productData, images: updatedImages });
  };

  const handleAddImage = () => {
    setProductData((prevData) => ({
      ...prevData,
      images: [...prevData.images, '']
    }));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...productData.images];
    updatedImages.splice(index, 1);
    setProductData({ ...productData, images: updatedImages });
  };

  // Gestion dynamique des couleurs
  const handleColorChange = (index, value) => {
    const updatedColors = [...productData.colors];
    updatedColors[index] = value;
    setProductData({ ...productData, colors: updatedColors });
  };

  const handleAddColor = () => {
    setProductData((prevData) => ({
      ...prevData,
      colors: [...prevData.colors, '']
    }));
  };

  const handleRemoveColor = (index) => {
    const updatedColors = [...productData.colors];
    updatedColors.splice(index, 1);
    setProductData({ ...productData, colors: updatedColors });
  };

  // Gestion dynamique des options de personnalisation
  const handleCustomizationChange = (index, field, value) => {
    const updatedOptions = [...productData.customizationOptions];
    updatedOptions[index][field] = value;
    setProductData({ ...productData, customizationOptions: updatedOptions });
  };

  const handleCustomizationSizeChange = (index, value) => {
    const updatedOptions = [...productData.customizationOptions];
    const sizesArray = value.split(',').map(size => size.trim());
    updatedOptions[index].customizationSize = sizesArray;
    setProductData({ ...productData, customizationOptions: updatedOptions });
  };

  const handleAddCustomizationOption = () => {
    setProductData((prevData) => ({
      ...prevData,
      customizationOptions: [...prevData.customizationOptions, { position: '', customizationSize: [''] }]
    }));
  };

  const handleRemoveCustomizationOption = (index) => {
    const updatedOptions = [...productData.customizationOptions];
    updatedOptions.splice(index, 1);
    setProductData({ ...productData, customizationOptions: updatedOptions });
  };

  const handleBackToList = () => {
    navigate('/products-list');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (id) {
        await axios.put(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/products/${id}`, productData);
        setSuccess(true);
        console.log('Produit mis à jour:', productData);
        showAlert('Produit mis à jour avec succès !', 'success');
      } else {
        await axios.post(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/products`, productData);
        setSuccess(true);
        console.log('Produit ajouté:', productData);
        showAlert('Produit ajouté avec succès !', 'success');
      }
      navigate(`/products-list`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout ou de la mise à jour du produit:', error);
      showAlert('Une erreur est survenue lors de l\'ajout ou de la mise à jour du produit.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 bg-gray-100">

      <div className="mb-6">
          <button
            onClick={handleBackToList}
            className="flex items-center px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition duration-300 shadow-md"
          >
            ← Retour à la liste des produits
          </button>
        </div>

        {/* Titre de la page */}
        <div className="bg-white p-4 md:p-6 rounded-md shadow-lg mb-6">
          <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold text-center text-gray-800">
            Modifier un produit
          </h2>
        </div>

      {/* {error && <p className="bg-red-100 text-red-700 p-4 rounded">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-4 rounded">Produit {id ? 'mis à jour' : 'ajouté'} avec succès !</p>} */}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 md:p-6 rounded-lg shadow-lg">
        
        <section className="bg-white p-6 md:p-8 rounded-md shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Informations générales</h3>

          {/* Nom du produit */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">
              Nom du produit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              rows="4"
            />
          </div>

          {/* Caractéristiques */}
          <div className="mb-4">
            <label htmlFor="characteristics" className="block text-gray-700 font-semibold mb-1">
              Caractéristiques <span className="text-red-500">*</span>
            </label>
            <textarea
              id="characteristics"
              name="characteristics"
              value={productData.characteristics}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              rows="4"
            />
          </div>
        </section>

        {/* Section pour les prix */}
        <section className="bg-white p-6 md:p-8 rounded-md shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Prix et Quantité</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prix */}
            <div>
              <label htmlFor="price" className="block text-gray-700 font-semibold mb-1">
                Prix <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={productData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            {/* Quantité */}
            <div>
              <label htmlFor="quantity" className="block text-gray-700 font-semibold mb-1">
                Quantité <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={productData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                min="0"
                required
              />
            </div>
          </div>
        </section>

        {/* Section pour les promotions */}
        <section className="bg-white p-6 md:p-8 rounded-md shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Promotion</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prix promotion */}
            <div>
              <label htmlFor="discountPrice" className="block text-gray-700 font-semibold mb-1">
                Prix promotion
              </label>
              <input
                type="number"
                id="discountPrice"
                name="discountPrice"
                value={productData.discountPrice}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${productData.isPromo ? 'border-gray-300' : 'border-gray-200 bg-gray-100'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
                min="0"
                step="0.01"
                disabled={!productData.isPromo}
              />
            </div>

            {/* Checkbox de promotion */}
            <div className="flex items-center mt-4 md:mt-0">
              <input
                type="checkbox"
                id="isPromo"
                name="isPromo"
                checked={productData.isPromo}
                onChange={handleChange}
                className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
              />
              <label htmlFor="isPromo" className="ml-3 text-gray-700 font-semibold">
                En promotion
              </label>
            </div>
          </div>
        </section>

        {/* Section Catégories */}
        <section className="bg-white p-6 md:p-8 rounded-md shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Catégories</h3>
          
          <div>
            <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={productData.category}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="" disabled>Sélectionnez une catégorie</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Section Couleurs */}
        <section className="bg-white p-6 md:p-8 rounded-md shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
            Couleurs <span className="text-red-500">*</span>
          </h3>
          
          {productData.colors.map((color, index) => (
            <div key={index} className="flex items-center mb-3">
              <input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Couleur"
              />
              <button
                type="button"
                onClick={() => handleRemoveColor(index)}
                className="ml-2 text-red-600 hover:text-red-800 transition duration-200"
                title="Supprimer"
              >
                <MdDeleteOutline size={24} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddColor}
            className="mt-4 px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition-colors"
          >
            Ajouter une couleur
          </button>
        </section>

        {/* Section Tailles */}
        <section className="bg-white p-6 md:p-8 rounded-md shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
            Tailles <span className="text-red-500">*</span>
          </h3>
          
          <div>
            {productData.sizes.map((size, index) => (
              <div key={index} className="flex items-center mb-3">
                <input
                  type="text"
                  value={size}
                  onChange={(e) => handleCustomSizeChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Taille personnalisée"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomSize(index)}
                  className="ml-2 text-red-600 hover:text-red-800 transition duration-200"
                  title="Supprimer"
                >
                  <MdDeleteOutline size={24} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddCustomSize}
              className="mt-4 px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition-colors"
            >
              Ajouter une taille
            </button>
          </div>
        </section>

        {/* Section Images */}
        <section className="bg-white p-6 md:p-8 rounded-md shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
            Images <span className="text-red-500">*</span>
          </h3>
          
          <div>
            {productData.images.map((image, index) => (
              <div key={index} className="flex items-center mb-3">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="URL de l'image"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="ml-2 text-red-600 hover:text-red-800 transition duration-200"
                  title="Supprimer"
                >
                  <MdDeleteOutline size={24} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddImage}
              className="mt-4 px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition-colors"
            >
              Ajouter une image
            </button>
          </div>
        </section>

        {/* Section Options de personnalisation */}
        <section className="bg-white p-6 md:p-8 rounded-md shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
            Options de personnalisation <span className="text-red-500">*</span>
          </h3>

          {productData.customizationOptions.map((option, index) => (
            <div key={index} className="space-y-3 bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Position</label>
                <input
                  type="text"
                  value={option.position}
                  onChange={(e) => handleCustomizationChange(index, 'position', e.target.value)}
                  placeholder="Position"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tailles de personnalisation</label>
                <input
                  type="text"
                  value={option.customizationSize.join(', ')}
                  onChange={(e) => handleCustomizationSizeChange(index, e.target.value)}
                  placeholder="Tailles de personnalisation (séparées par des virgules)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => handleRemoveCustomizationOption(index)} 
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddCustomizationOption}
            className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md"
          >
            Ajouter une option de personnalisation
          </button>
        </section>

        <button
          type="submit"
          className={`w-full py-3 px-4 text-lg font-semibold rounded-md transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
              : 'bg-sky-600 text-white hover:bg-sky-700'
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291a7.963 7.963 0 01-2-5.291H0c0 2.761 1.119 5.261 2.929 7.071l1.414-1.414z"
                ></path>
              </svg>
              <span>Envoi en cours...</span>
            </div>
          ) : (
            'Mettre à jour le produit'
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdProduct;
