import React from 'react';
import { useNavigate } from 'react-router-dom';

const UsersList = ({ users }) => {
  const navigate = useNavigate();

  const handleViewOrders = (userId) => {
    navigate(`/user-orders/${userId}`);
  };  

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left border-b">Nom</th>
            <th className="py-3 px-4 text-left border-b">Email</th>
            <th className="py-3 px-4 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100 transition duration-200">
                <td className="py-2 px-4 border-b">
                  {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`}
                </td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleViewOrders(user._id)}
                    className="bg-blue-500 text-white px-2 md:px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Voir commandes
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4 text-gray-500">Aucun utilisateur trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
