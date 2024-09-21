import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";

const sizesOptions = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

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
    category: [],
    images: [''],
    colors: [''], 
    sizes: [],
    isPromo: false,
    customizationOptions: [{
      position: '',
      customizationSize: ['']
    }],
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Récupérer les catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/category`);
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Récupérer les données du produit existant si un ID est présent
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/products/${id}`);
          setProductData(response.data);
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

  const handleSizeToggle = (size) => {
    setProductData(prevData => {
      const sizes = [...prevData.sizes];
      const sizeIndex = sizes.indexOf(size);
      if (sizeIndex > -1) {
        sizes.splice(sizeIndex, 1);
      } else {
        sizes.push(size);
      }
      return { ...prevData, sizes };
    });
  };

  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(e.target.selectedOptions, option => option.value);
    setProductData({ ...productData, category: selectedCategories });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (id) {
        // Mettre à jour le produit existant
        await axios.put(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/products/${id}`, productData);
        setSuccess(true);
        console.log('Produit mis à jour:', productData);
      } else {
        // Ajouter un nouveau produit
        await axios.post(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/products`, productData);
        setSuccess(true);
        console.log('Produit ajouté:', productData);
      }
      navigate(`/ListProduct`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout ou de la mise à jour du produit:', error);
      setError('Une erreur est survenue lors de la soumission du produit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 bg-gray-100">
      <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold mb-4">{id ? 'Éditer le produit' : 'Ajouter un produit'}</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Produit {id ? 'mis à jour' : 'ajouté'} avec succès !</p>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 md:p-6 rounded-lg shadow-lg">
        {/* Nom du produit */}
        <div>
          <label htmlFor="name" className="block text-gray-700 font-bold">Nom du produit</label>
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
          <label htmlFor="description" className="block text-gray-700 font-bold">Description</label>
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
          <label htmlFor="characteristics" className="block text-gray-700 font-bold">Caractéristiques</label>
          <textarea
            id="characteristics"
            name="characteristics"
            value={productData.characteristics}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

                {/* Prix et Quantité */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-gray-700 font-bold">Prix</label>
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
            <label htmlFor="quantity" className="block text-gray-700 font-bold">Quantité</label>
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

        {/* Section pour la promotion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Champ pour le prix promotionnel */}
          <div>
            <label htmlFor="discountPrice" className="block text-gray-700 font-bold">Prix promotion</label>
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

          {/* Checkbox pour la promotion */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPromo"
              name="isPromo"
              checked={productData.isPromo}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="isPromo" className="ml-2 text-gray-700 font-bold">En promotion</label>
          </div>
        </div>

        {/* Catégories */}
        <div>
          <label htmlFor="category" className="block text-gray-700 font-bold">Catégories</label>
          <select
            id="category"
            name="category"
            multiple
            value={productData.category}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500">Maintenez "Ctrl" pour sélectionner plusieurs catégories</p>
        </div>

        {/* Images */}
        <div>
          <label htmlFor="images" className="block text-gray-700 font-bold">Images</label>
          {productData.images.map((image, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="URL de l'image"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="text-red-500"
              >
                <MdDeleteOutline />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImage}
            className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg"
          >
            Ajouter une image
          </button>
        </div>

        {/* Couleurs */}
        <div>
          <label htmlFor="colors" className="block text-gray-700 font-bold">Couleurs</label>
          {productData.colors.map((color, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Couleur"
              />
              <button
                type="button"
                onClick={() => handleRemoveColor(index)}
                className="text-red-500"
              >
                <MdDeleteOutline />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddColor}
            className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg"
          >
            Ajouter une couleur
          </button>
        </div>

        {/* Tailles */}
        <div>
          <label htmlFor="sizes" className="block text-gray-700 font-bold">Tailles</label>
          <div className="flex flex-wrap gap-2">
            {sizesOptions.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`px-4 py-2 rounded border ${
                  productData.sizes.includes(size)
                    ? 'bg-blue-500 text-white border-blue-600'
                    : 'bg-gray-200 text-gray-800 border-gray-400'
                } hover:bg-blue-600 hover:border-blue-700 transition-colors`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Options de personnalisation */}
        <div>
          <label htmlFor="customizationOptions" className="block text-gray-700 font-bold">Options de personnalisation</label>
          <div className="space-y-4">
            {productData.customizationOptions.map((option, index) => (
              <div key={index} className="space-y-2">
                <input
                  type="text"
                  name={`position-${index}`}
                  value={option.position}
                  onChange={(e) => handleCustomizationChange(index, 'position', e.target.value)}
                  placeholder="Position"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  name={`customizationSize-${index}`}
                  value={option.customizationSize.join(', ')}
                  onChange={(e) => handleCustomizationSizeChange(index, e.target.value)}
                  placeholder="Tailles de personnalisation (séparées par des virgules)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomizationOption(index)}
                  className="text-red-500"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddCustomizationOption}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ajouter une option de personnalisation
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? 'Envoi en cours...' : 'Mettre à jour le produit'}
        </button>
      </form>
    </div>
  );
};

export default UpdProduct;
