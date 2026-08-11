'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message === 'Invalid login credentials' 
          ? 'Correo electrónico o contraseña incorrectos.' 
          : err.message
        );
      } else {
        setError('Ocurrió un error inesperado al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
        
        {error && (
          <div className="rounded-md bg-red-50 p-3 border border-red-200 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:outline-none"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 py-2 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}