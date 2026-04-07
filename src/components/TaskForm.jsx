import { useState } from 'react'
import { Plus, Rows3 } from 'lucide-react'

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('')
  const [stepsText, setStepsText] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    // Limpia entradas y convierte el textarea en una lista de sub-pasos validos.
    const cleanTitle = title.trim()
    const steps = stepsText
      .split('\n')
      .map((step) => step.trim())
      .filter(Boolean)

    if (!cleanTitle) {
      setError('El titulo es obligatorio.')
      return
    }

    if (steps.length === 0) {
      setError('Agrega al menos un sub-paso (uno por linea).')
      return
    }

    // Envia la tarea al padre y reinicia el formulario para una nueva captura.

    // Envia la tarea al padre y reinicia el formulario para una nueva captura.
    onAddTask({ title: cleanTitle, steps })
    setTitle('')
    setStepsText('')
    setError('')
  }

  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg sm:p-6">
      <h2 className="text-lg font-semibold text-slate-100">Nueva tarea</h2>
      <p className="mt-1 text-sm text-slate-400">Escribe sub-pasos separados por lineas.</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="title">
            Titulo de la tarea
          </label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Preparar presentacion semanal"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="steps">
            Sub-pasos (uno por linea)
          </label>
          <div className="relative">
            <Rows3 size={16} className="pointer-events-none absolute left-3 top-3 text-slate-500" />
            <textarea
              id="steps"
              rows={4}
              value={stepsText}
              onChange={(event) => setStepsText(event.target.value)}
              placeholder={'Investigar tema\nCrear borrador\nRevisar y entregar'}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-500 focus:border-sky-500"
            />
          </div>
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          <Plus size={16} />
          Agregar tarea
        </button>
      </form>
    </article>
  )
}

export default TaskForm
