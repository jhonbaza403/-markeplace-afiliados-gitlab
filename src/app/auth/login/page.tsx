'import client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-600">Correo Electrónico</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-600">Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="w-full rounded bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition">Entrar</button>
      </form>
    </div>
  )
}