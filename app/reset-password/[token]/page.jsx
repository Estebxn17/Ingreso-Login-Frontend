'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage({ params }) {
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const router = useRouter();
  const { token } = params;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaContraseña }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Contraseña restablecida con éxito');
        router.push('/inicio'); // Redirige al inicio de sesión
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-800">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-zinc-900 p-8 rounded-lg shadow-lg border border-gray-300"
      >
        <h2 className="text-center text-2xl font-semibold text-white mb-6">
          Restablecer Contraseña
        </h2>

        <div className="mb-6">
          <label
            htmlFor="nuevaContraseña"
            className="block text-sm font-medium text-white mb-2"
          >
            Nueva Contraseña:
          </label>
          <input
            type="password"
            id="nuevaContraseña"
            name="nuevaContraseña"
            value={nuevaContraseña}
            onChange={(e) => setNuevaContraseña(e.target.value)}
            placeholder="Ingresa tu nueva contraseña"
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Restablecer Contraseña
        </button>
      </form>
    </div>
  );
}
