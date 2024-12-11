"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function Registro() {
  const router = useRouter(); // Inicializa el hook useRouter
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // Para clasificar mensajes de error o éxito

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(""); // Reiniciar el mensaje
    setTipoMensaje(""); // Reiniciar el tipo de mensaje

    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        formData
      );
      setMensaje(response.data.message || "Registro exitoso");
      setTipoMensaje("success");

      
      setTimeout(() => {
        router.push("/inicio"); // Cambia "/ruta-destino" por la ruta a donde quieres redirigir
      }, 2000);
    } catch (error) {
      if (error.response?.data?.error === "El correo ya está registrado") {
        setMensaje("Este correo ya está en uso, intenta con otro.");
        setTipoMensaje("error");
      } else {
        setMensaje(
          error.response?.data?.error || "Ocurrió un error inesperado."
        );
        setTipoMensaje("error");
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-32 bg-zinc-800 p-8 rounded-lg shadow-2xl border border-gray-300"
      >
        <h2 className="text-center text-2xl font-semibold text-white mb-6">Registro</h2>

        <div className="mb-6">
          <label
            htmlFor="nombre"
            className="block mb-2 text-sm font-medium text-white"
          >
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="apellido"
            className="block mb-2 text-sm font-medium text-white"
          >
            Apellido:
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="correo"
            className="block mb-2 text-sm font-medium text-white"
          >
            Correo:
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="contraseña"
            className="block mb-2 text-sm font-medium text-white"
          >
            Contraseña:
          </label>
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
          Registrarme
        </button>

        {mensaje && (
          <p
            className={`text-center text-sm mt-4 ${
              tipoMensaje === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {mensaje}
          </p>
        )}

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-blue-500 hover:underline block mt-2"
          >
            Volver al Inicio
          </a>
        </div>
      </form>
    </>
  );
}
