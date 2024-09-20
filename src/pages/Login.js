import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [alertMessage, setAlertMessage] = useState(''); 
  const [alertType, setAlertType] = useState(''); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/users/signin`, formData);

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        navigate('/'); 
      }
    } catch (error) {
      setAlertMessage(error.response?.data?.message || 'Erreur lors de la connexion');
      setAlertType('error');
    }
  };
  
  return (
    <div>
      <LoginForm/>
    </div>
  );
};

export default Login;
