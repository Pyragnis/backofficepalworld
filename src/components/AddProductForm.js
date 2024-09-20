import React, { useState, useEffect } from 'react';
import axios from 'axios';

const sizesOptions = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

const AddProductForm = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    characteristics: '',
    price: 0,
    discountPrice:0,
    quantity: 0,
    category: [], // Ajouter le champ catégorie
    images: '',
    colors: '',
    sizes: [],
    isPromo: false, // Nouveau champ pour la promotion
    customizationOptions: [{
      position: '',
      customizationSize: ['']
    }],
  });

  const [categories, setCategories] = useState([]); // Stocker les catégories récupérées
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Récupérer les catégories depuis l'API au chargement du composant
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/category');
        setCategories(response.data); // Stocker les catégories
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({ 
      ...productData, 
      [name]: type === 'checkbox' ? checked : value // Gérer les champs texte et checkbox
    });
  };

  const handleSizeToggle = (size) => {
    setProductData(prevData => {
      const sizes = [...prevData.sizes];
      const sizeIndex = sizes.indexOf(size);
      if (sizeIndex > -1) {
        sizes.splice(sizeIndex, 1); // Retirer la taille
      } else {
        sizes.push(size); // Ajouter la taille
      }
      return { ...prevData, sizes };
    });
  };

  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(e.target.selectedOptions, option => option.value);
    setProductData({ ...productData, category: selectedCategories });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post('http://localhost:3005/api/products', productData);
      setSuccess(true);
      console.log('Produit ajouté:', response.data);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      setError('Une erreur est survenue lors de l\'ajout du produit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-8 ml-1">
      <h2 className="text-2xl font-bold mb-4">Ajouter un produit</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Produit ajouté avec succès !</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Prix */}
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
        {/* DiscountPrix */}
        <div>
          <label htmlFor="price" className="block text-gray-700 font-bold">Prix promotion</label>
          <input
            type="number"
            id="discountPrice"
            name="discountPrice"
            value={productData.discountPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Quantité */}
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

        {/* Promo */}
        <div>
          <label htmlFor="isPromo" className="block text-gray-700 font-bold">En promotion</label>
          <input
            type="checkbox"
            id="isPromo"
            name="isPromo"
            checked={productData.isPromo}
            onChange={handleChange}
            className="w-4 h-4"
          />
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
          <input
            type="text"
            id="images"
            name="images"
            value={productData.images}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-sm text-gray-500">Séparez les URL d'images par des virgules</p>
        </div>

        {/* Couleurs */}
        <div>
          <label htmlFor="colors" className="block text-gray-700 font-bold">Couleurs</label>
          <input
            type="text"
            id="colors"
            name="colors"
            value={productData.colors}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-sm text-gray-500">Séparez les couleurs par des virgules</p>
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
                  onChange={(e) => {
                    const newOptions = [...productData.customizationOptions];
                    newOptions[index].position = e.target.value;
                    setProductData({ ...productData, customizationOptions: newOptions });
                  }}
                  placeholder="Position"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />

                <div>
                  <label htmlFor={`customizationSize-${index}`} className="block text-gray-700 font-bold">Taille de personnalisation</label>
                  <select
                    id={`customizationSize-${index}`}
                    name={`customizationSize-${index}`}
                    value={option.customizationSize[0]} // Modifier pour prendre en compte la première option
                    onChange={(e) => {
                      const newOptions = [...productData.customizationOptions];
                      newOptions[index].customizationSize = [e.target.value];
                      setProductData({ ...productData, customizationOptions: newOptions });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {sizesOptions.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? 'Ajout en cours...' : 'Ajouter le produit'}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
