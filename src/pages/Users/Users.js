import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/sidebar';
import UsersList from '../../components/UsersList';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;

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

  const filteredUsers = users.filter((user) => {
    const userFirstName = user.firstName ? user.firstName.toLowerCase() : '';
    const userLastName = user.lastName ? user.lastName.toLowerCase() : '';
    const userFullName = user.fullName ? user.fullName.toLowerCase() : '';
    const userEmail = user.email ? user.email.toLowerCase() : '';
    
    return (
      userFirstName.includes(searchQuery.toLowerCase()) ||
      userLastName.includes(searchQuery.toLowerCase()) ||
      userFullName.includes(searchQuery.toLowerCase()) ||
      userEmail.includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchUsers();
  }, []);

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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {loading ? (
          <p>Chargement des utilisateurs...</p>
        ) : (
          <>
            <UsersList users={currentUsers} />

            {/* Pagination */}
            <div className="flex justify-center flex-wrap mt-4">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`mx-1 px-3 py-1 rounded mb-2 ${
                    currentPage === pageNumber ? 'bg-sky-600 text-white hover:bg-sky-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
