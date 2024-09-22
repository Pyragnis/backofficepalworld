import React from 'react';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';

const DataTable = ({ columns, data, actions, onSort, sortConfig }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-sm leading-normal rounded-t-lg">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={`py-3 px-4 text-left cursor-pointer ${col.sortable ? 'hover:bg-gray-300' : ''}`}
                onClick={() => col.sortable && onSort(col.accessor)}
              >
                <div className="flex items-center">
                  {col.header}
                  {col.sortable && (
                    <span className="ml-1 flex">
                      {/* Afficher les deux flèches ensemble */}
                      <AiOutlineArrowUp
                        className={`ml-1 ${sortConfig.key === col.accessor && sortConfig.direction === 'asc' ? 'text-black' : 'text-gray-400'}`}
                      />
                      <AiOutlineArrowDown
                        className={`ml-1 ${sortConfig.key === col.accessor && sortConfig.direction === 'desc' ? 'text-black' : 'text-gray-400'}`}
                      />
                    </span>
                  )}
                </div>
              </th>
            ))}
            {actions && <th className="py-3 px-4 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100 transition duration-200 border-b border-gray-200">
                {columns.map((col) => (
                  <td key={col.accessor} className="py-2 px-4">
                    {col.render ? col.render(row) : row[col.accessor] || 'N/A'}
                  </td>
                ))}
                {actions && (
                  <td className="py-2 px-4 flex space-x-2">
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={() => action.onClick(row)}
                        className="px-2 py-1 rounded transition duration-300"
                      >
                        {action.render ? action.render(row) : action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-4 text-gray-500">
                Aucun élément trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
