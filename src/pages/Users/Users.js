import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/sidebar';
import DataTable from '../../components/DataTable';
import Pagination from '../../components/Pagination';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineReload, AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { IoReceiptSharp } from "react-icons/io5";
import { BiLoaderCircle } from 'react-icons/bi'; 

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Ajout de l'état de tri
  const usersPerPage = 12;

  const navigate = useNavigate(); 

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:${process.env.REACT_APP_PORT_BDD_API}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      showAlert('Erreur lors du chargement des utilisateurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 px-4 py-2 rounded shadow-lg transition duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    alertDiv.innerText = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      setTimeout(() => document.body.removeChild(alertDiv), 300);
    }, 3000);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const filteredUsers = sortedUsers.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (user.firstName && user.firstName.toLowerCase().includes(searchLower)) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchLower)) ||
      (user.fullName && user.fullName.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower))
    );
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const columns = [
    { header: 'Prénom', accessor: 'firstName', sortable: true },
    { header: 'Nom', accessor: 'lastName', sortable: true },
    { header: 'Email', accessor: 'email' },
    { header: 'Téléphone', accessor: 'phone' },
    {
      header: 'Adresse',
      accessor: 'address',
      render: (user) =>
        user.address
          ? `${user.address}, ${user.city}, ${user.country}, ${user.codePostal}`
          : 'N/A',
    },
    { header: 'Crédits', accessor: 'credits' },
    {
      header: 'Vérifié',
      accessor: 'isVerified',
      render: (user) => (
        <span className={`px-2 py-1 rounded text-white ${user.isVerified ? 'bg-green-500' : 'bg-red-500'}`}>
          {user.isVerified ? 'Oui' : 'Non'}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'Voir commandes',
      onClick: (user) => {
        navigate(`/user-orders/${user._id}`);
      },
      render: () => (
        <IoReceiptSharp className="text-blue-500 hover:text-sky-700 cursor-pointer" />
      ),
    },
  ];

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-60">
        <Sidebar />
      </div>
      <div className="flex-1 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Utilisateurs</h2>
          <AiOutlineReload 
            onClick={fetchUsers} 
            className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl" 
            title="Recharger les utilisateurs"
          />
        </div>

        <div className="mb-4 flex items-center border rounded-md p-2">
          <AiOutlineSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur par nom ou email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-1 outline-none"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <BiLoaderCircle className="animate-spin text-3xl text-blue-500" />
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={currentUsers} actions={actions} onSort={handleSort} sortConfig={sortConfig} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
