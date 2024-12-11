"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Importa useRouter para manejar la navegación

export default function Iniciar() {
  const [formData, setFormData] = useState({ correo: "", contraseña: "" });
  const [mensaje, setMensaje] = useState("");
  const router = useRouter(); // Instancia del enrutador

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
      setMensaje("Inicio de sesión exitoso");
      localStorage.setItem("token", response.data.token);

      // Redirigir al usuario después de 2 segundos
      setTimeout(() => {
        router.push("/"); // Cambia "/dashboard" a la ruta deseada
      }, 2000);
    } catch (error) {
      setMensaje(error.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-zinc-800 p-8 mt-32 rounded-lg shadow-2xl border border-gray-300"
      >
        <h1 className="text-center text-2xl font-semibold text-white mb-6">Bienvenido, Inicia Sesión</h1>
        <div className="mb-6">
          <label htmlFor="correo" className="block mb-2 text-sm font-medium text-white">Correo:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
            placeholder="example@gmail.com"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="contraseña" className="block mb-2 text-sm font-medium text-white ">Contraseña:</label>
          <input
            type="password"
            id="contraseña"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-green-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Iniciar Sesión
        </button>
        <div className="mt-6 text-center">
          {mensaje && <p className="text-sm text-green-500 mt-4">{mensaje}</p>}
          <a href="/" className="text-sm text-blue-500 hover:underline mt-2 block">Volver al Inicio</a>
          <a href="/recover-password" className="text-sm text-blue-500 hover:underline mt-2 block">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
    </>
  );
}
