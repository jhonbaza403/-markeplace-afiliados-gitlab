'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('buyer')
  const [identificationType, setIdentificationType] = useState('cedula')
  const [idNumber, setIdNumber] = useState('')
  const [frontPhoto, setFrontPhoto] = useState<File | null>(null)
  const [sidePhoto1, setSidePhoto1] = useState<File | null>(null)
  const [sidePhoto2, setSidePhoto2] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      })

      if (authError) throw authError
      const user = authData.user

      if (user) {
        // Registro de los datos de verificación en la tabla profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: fullName,
            role: role,
            identification_type: identificationType,
            identification_number: idNumber,
            verification_status: 'pending'
          })

        if (profileError) {
          console.error('Error al guardar el perfil:', profileError.message)
        }
      }

      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <form onSubmit={handleRegister} className="w-full max-w-xl rounded-lg bg-white p-8 shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Crear Cuenta y Verificación</h2>
        
        {error && <div className="rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Nombre Completo / Razón Social</label>
          <input 
            type="text" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            required 
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de Usuario</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="buyer">Comprador</option>
              <option value="affiliate">Afiliado</option>
              <option value="vendor">Vendedor / Empresa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Documento (Cédula / RIF)</label>
            <div className="flex gap-2">
              <select 
                value={identificationType} 
                onChange={(e) => setIdentificationType(e.target.value)}
                className="rounded border px-2 py-2 bg-white text-sm focus:outline-none"
              >
                <option value="cedula">Cédula</option>
                <option value="rif">RIF</option>
              </select>
              <input 
                type="text" 
                placeholder="Número"
                value={idNumber} 
                onChange={(e) => setIdNumber(e.target.value)} 
                required 
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
        </div>

        {/* Sección de fotos obligatorias */}
        <div className="rounded-lg border p-4 bg-gray-50 space-y-4">
          <h3 className="text-sm font-bold text-gray-700">Verificación de Identidad (Fotos)</h3>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Foto del Documento (De frente / RIF):</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setFrontPhoto(e.target.files?.[0] || null)}
              required 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Foto Lado 1 (Reverso / Lateral):</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setSidePhoto1(e.target.files?.[0] || null)}
                required 
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Foto Lado 2 (Lateral opuesto):</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setSidePhoto2(e.target.files?.[0] || null)}
                required 
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full rounded bg-green-600 py-3 font-semibold text-white hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </div>
  )
}