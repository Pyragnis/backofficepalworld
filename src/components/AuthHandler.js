import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    if (token) {
      console.log("Token récupéré:", token);

      const localCart = JSON.parse(localStorage.getItem('cart')) || [];

      // Envoyer le token et le panier local au backend
      axios.post('http://localhost:3005/api/users/signin', {
        token,
        localCart,
      })
      .then(response => {
        console.log("Panier synchronisé:", response.data);
        localStorage.removeItem('cart'); 
        localStorage.setItem('token', token);
        navigate('/');
      })
      .catch(error => {
        console.error("Erreur lors de la synchronisation du panier:", error);
      });
    }
  }, [navigate]);

  return null;
};

export default AuthHandler;
