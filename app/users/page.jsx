"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]); // Estado para almacenar los usuarios
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const [editingUser, setEditingUser] = useState(null); // Usuario que se está editando
  const [newName, setNewName] = useState(""); // Nuevo nombre para edición

  // Función para cargar los usuarios desde el backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // Obtener el token del almacenamiento local
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en los headers
        },
      });

      // Validación de la respuesta
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data); // Actualiza el estado con la lista de usuarios
      } else {
        setError("No se encontraron usuarios.");
      }
    } catch (error) {
      console.error("Error al cargar los usuarios:", error.message);
      setError(
        `Hubo un error al cargar los usuarios: ${
          error.response ? error.response.data.error : error.message
        }`
      );
    } finally {
      setLoading(false); 
    }
  };

  // Función para eliminar un usuario
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user._id !== id)); // Eliminar usuario del estado
    } catch (error) {
      console.error("Error al eliminar usuario:", error.message);
      setError(
        `Hubo un error al eliminar el usuario: ${
          error.response ? error.response.data.error : error.message
        }`
      );
    }
  };

  // Función para iniciar la edición de un usuario
  const startEdit = (user) => {
    setEditingUser(user);
    setNewName(user.nombre); // Prellenar con el nombre actual
  };

  // Función para guardar los cambios de edición
  const handleEdit = async () => {
    if (!editingUser) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/users/${editingUser._id}`,
        { nombre: newName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Actualizar el usuario en el estado
      setUsers(
        users.map((user) =>
          user._id === editingUser._id ? { ...user, nombre: newName } : user
        )
      );
      setEditingUser(null); // Cerrar el modal de edición
    } catch (error) {
      console.error("Error al editar usuario:", error.message);
      setError(
        `Hubo un error al editar el usuario: ${
          error.response ? error.response.data.error : error.message
        }`
      );
    }
  };

  // Cargar usuarios cuando el componente se monta
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-center text-xl">Cargando usuarios...</p>;
  }

  return (
    <div className="relative overflow-x-auto shadow-xl rounded-lg bg-white dark:bg-zinc-800">
      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-gray-100 dark:bg-zinc-900 rounded-t-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
          Lista de Usuarios
        </h2>
      </div>

      {error && <p className="text-center text-red-500 font-semibold">{error}</p>}

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-blue-500 dark:bg-zinc-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 text-white">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3 text-white">
              Correo
            </th>
            <th scope="col" className="px-6 py-3 text-white">
              Editar
            </th>
            <th scope="col" className="px-6 py-3 text-white">
              Eliminar
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user._id}
                className="bg-zinc-500 border-b dark:bg-zinc-900 dark:border-gray-700 hover:bg-gray-600 dark:hover:bg-zinc-800 transition-colors duration-200"
              >
                <td className="px-6 py-4">{user.nombre}</td>
                <td className="px-6 py-4">{user.correo}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => startEdit(user)}
                    className="relative px-4 py-2 font-semibold text-black bg-green-600 rounded-lg shadow-md group transition-transform duration-300 ease-in-out hover:translate-y-1 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-800"
                  >
                    Editar
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="relative px-4 py-2 font-semibold text-black bg-red-600 rounded-lg shadow-md group transition-transform duration-300 ease-in-out hover:translate-y-1 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No hay usuarios disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de edición */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-zinc-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Editar Usuario</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border rounded p-2 w-full mb-4 text-black"
            />
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditingUser(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
