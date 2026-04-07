import { useState } from 'react'
import { LogIn, UserRound } from 'lucide-react'

function UserGate({ onSetUser }) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    // Normaliza el texto para evitar usuarios vacios con espacios.
    const cleanName = username.trim()
    if (!cleanName) {
      setError('Debes ingresar un nombre de usuario.')
      return
    }

    // Envia el usuario al componente padre para activar/cargar su sesion local.
    setError('')
    onSetUser(cleanName)
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <div className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 p-6 shadow-xl sm:p-8">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          <LogIn size={14} />
          Identificacion local
        </p>
        <h1 className="text-2xl font-bold text-slate-100">Bienvenido a Lista de Tareas Pro</h1>
        <p className="mt-2 text-sm text-slate-400">
          Escribe tu nombre de usuario para cargar tus tareas guardadas.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-300" htmlFor="username">
            Nombre de usuario
          </label>
          <div className="relative">
            <UserRound
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Ej: Juan"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-10 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-500"
            />
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Entrar
          </button>
        </form>
      </div>
    </section>
  )
}

export default UserGate
