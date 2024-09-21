import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";

const UpdProduct = () => {
  const { id } = useParams();
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
      } else {
        await axios.post(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/products`, productData);
        setSuccess(true);
        console.log('Produit ajouté:', productData);
      }
      navigate(`/products-list`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout ou de la mise à jour du produit:', error);
      setError('Une erreur est survenue lors de la soumission du produit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 bg-gray-100">

      <div className="mb-4">
        <button
          onClick={handleBackToList}
          className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors"
        >
          Retour à la liste des produits
        </button>
      </div>

      <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold mb-4">{id ? 'Éditer le produit' : 'Ajouter un produit'}</h2>

      {error && <p className="bg-red-100 text-red-700 p-4 rounded">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-4 rounded">Produit {id ? 'mis à jour' : 'ajouté'} avec succès !</p>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 md:p-6 rounded-lg shadow-lg">
        
      <section>
          <h3 className="text-xl font-bold mb-2">Informations générales</h3>
          {/* Nom du produit */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold">
              Nom du produit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-700 font-semibold mt-4">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Caractéristiques */}
          <div>
            <label htmlFor="characteristics" className="block text-gray-700 font-semibold">
              Caractéristiques <span className="text-red-500">*</span>
            </label>
            <textarea
              id="characteristics"
              name="characteristics"
              value={productData.characteristics}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </section>

        {/* Section pour les prix */}
        <section>
          <h3 className="text-xl font-bold mb-2">Prix et Quantité</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-gray-700 font-semibold">
                Prix <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={productData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-gray-700 font-semibold">
                Quantité <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={productData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="0"
                required
              />
            </div>
          </div>
        </section>

        {/* Section pour les promotions */}
        <section>
          <h3 className="text-xl font-bold mb-2">Promotion</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="discountPrice" className="block text-gray-700 font-semibold">Prix promotion</label>
              <input
                type="number"
                id="discountPrice"
                name="discountPrice"
                value={productData.discountPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="0"
                step="0.01"
                disabled={!productData.isPromo}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPromo"
                name="isPromo"
                checked={productData.isPromo}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label htmlFor="isPromo" className="ml-2 text-gray-700 font-semibold">En promotion</label>
            </div>
          </div>
        </section>

        {/* Section Catégories */}
        <section>
          <h3 className="text-xl font-bold mb-2">Catégories</h3>
          <label htmlFor="category" className="block text-gray-700 font-semibold">
            Catégories <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={productData.category}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="" disabled>Sélectionnez une catégorie</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </section>

        {/* Section Couleurs */}
        <section>
          <h3 className="text-xl font-bold mb-2">
            Couleurs <span className="text-red-500">*</span>
          </h3>
          {productData.colors.map((color, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Couleur"
              />
              <button type="button" onClick={() => handleRemoveColor(index)} className="text-red-500">
                <MdDeleteOutline />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddColor}
            className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-normal rounded-lg"
          >
            Ajouter une couleur
          </button>
        </section>

        {/* Section Tailles */}
        <section>
          <h3 className="text-xl font-bold mb-2">
            Tailles <span className="text-red-500">*</span>
          </h3>
          <div>
            {productData.sizes.map((size, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={size}
                  onChange={(e) => handleCustomSizeChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Taille personnalisée"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomSize(index)}
                  className="text-red-500"
                >
                  <MdDeleteOutline />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCustomSize}
              className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-normal rounded-lg"
            >
              Ajouter une taille
            </button>
          </div>
        </section>

        {/* Section Images */}
        <section>
          <h3 className="text-xl font-bold mb-2">
            Images <span className="text-red-500">*</span>
          </h3>
          {productData.images.map((image, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="URL de l'image"
              />
              <button type="button" onClick={() => handleRemoveImage(index)} className="text-red-500">
                <MdDeleteOutline />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImage}
            className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-normal rounded-lg"
          >
            Ajouter une image
          </button>
        </section>

        {/* Section Options de personnalisation */}
        <section>
          <h3 className="text-xl font-bold mb-2">
            Options de personnalisation <span className="text-red-500">*</span>
          </h3>
          {productData.customizationOptions.map((option, index) => (
            <div key={index} className="space-y-2">
              <input
                type="text"
                value={option.position}
                onChange={(e) => handleCustomizationChange(index, 'position', e.target.value)}
                placeholder="Position"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2"
              />
              <input
                type="text"
                value={option.customizationSize.join(', ')}
                onChange={(e) => handleCustomizationSizeChange(index, e.target.value)}
                placeholder="Tailles de personnalisation (séparées par des virgules)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button type="button" onClick={() => handleRemoveCustomizationOption(index)} className="text-red-500">
                Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddCustomizationOption}
            className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-normal rounded-lg"
          >
            Ajouter une option de personnalisation
          </button>
        </section>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Envoi en cours...' : 'Mettre à jour le produit'}
        </button>
      </form>
    </div>
  );
};

export default UpdProduct;
