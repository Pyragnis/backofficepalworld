import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/sidebar';
import UsersList from '../../components/UsersList';
import Pagination from '../../components/Pagination';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ajout d'un débouncer pour la recherche
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrer les utilisateurs en fonction de la requête de recherche
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (user.firstName && user.firstName.toLowerCase().includes(searchLower)) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchLower)) ||
      (user.fullName && user.fullName.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower))
    );
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Gestion du changement de page
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-60">
        <Sidebar />
      </div>
      <div className="flex-1 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Utilisateurs</h2>

        {/* Barre de recherche */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher un utilisateur par nom ou email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {loading ? (
          <p>Chargement des utilisateurs...</p>
        ) : (
          <>
            <UsersList users={currentUsers} />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
