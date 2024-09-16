import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const sizesOptions = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

const UpdProduct = () => {
  const { id } = useParams(); // Obtenir l'ID du produit depuis les paramètres de l'URL (pour l'édition)
  const navigate = useNavigate(); // Pour rediriger après la soumission
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    characteristics: '',
    price: 0,
    quantity: 0,
    category: [], // Ajouter le champ catégorie
    images: '',
    colors: '',
    sizes: [],
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

  // Si un ID est présent, récupérer les données du produit
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:3005/api/products/${id}`);
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
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSizeToggle = (size) => {
    setProductData(prevData => {
      const sizes = [...prevData.sizes];
      const sizeIndex = sizes.indexOf(size);
      if (sizeIndex > -1) {
        sizes.splice(sizeIndex, 1); // Remove size
      } else {
        sizes.push(size); // Add size
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
      if (id) {
        // Si un ID est présent, mettre à jour le produit existant
        await axios.put(`http://localhost:3005/api/products/${id}`, productData);
        setSuccess(true);
        console.log('Produit mis à jour:', productData);
      } else {
        // Sinon, ajouter un nouveau produit
        await axios.post('http://localhost:3005/api/products', productData);
        setSuccess(true);
        console.log('Produit ajouté:', productData);
      }
      navigate(`/products`); // Redirige vers la liste des produits après la soumission
    } catch (error) {
      console.error('Erreur lors de l\'ajout ou de la mise à jour du produit:', error);
      setError('Une erreur est survenue lors de la soumission du produit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-8 ml-1">
      <h2 className="text-2xl font-bold mb-4">{id ? 'Éditer le produit' : 'Ajouter un produit'}</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Produit {id ? 'mis à jour' : 'ajouté'} avec succès !</p>}

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
                  required
                />
                <input
                  type="text"
                  name={`customizationSize-${index}`}
                  value={option.customizationSize.join(', ')}
                  onChange={(e) => {
                    const newOptions = [...productData.customizationOptions];
                    newOptions[index].customizationSize = e.target.value.split(', ');
                    setProductData({ ...productData, customizationOptions: newOptions });
                  }}
                  placeholder="Tailles de personnalisation (séparées par des virgules)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {loading ? 'Envoi en cours...' : (id ? 'Mettre à jour le produit' : 'Ajouter le produit')}
        </button>
      </form>
    </div>
  );
};

export default UpdProduct;
