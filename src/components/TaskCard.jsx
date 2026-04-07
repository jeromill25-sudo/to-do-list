import { Check, CircleCheckBig, CircleDashed, Trash2 } from 'lucide-react'

function TaskCard({ task, onToggleStep, onFinishTask }) {
  // Calcula el progreso real de la tarea a partir de sus sub-pasos completados.
  const totalSteps = task.steps.length
  const completedSteps = task.steps.filter((step) => step.done).length
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
  const isCompleted = progress === 100

  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-400">
            {completedSteps}/{totalSteps} sub-pasos completados
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isCompleted ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
          }`}
        >
          {progress}%
        </span>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-400' : 'bg-sky-400'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="space-y-2">
        {task.steps.map((step) => (
          <li
            key={step.id}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
              step.done
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                : 'border-slate-700 bg-slate-950/60 text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              {step.done ? <CircleCheckBig size={16} /> : <CircleDashed size={16} />}
              {step.text}
            </span>
            <button
              // Permite alternar rapidamente el estado del sub-paso.
              onClick={() => onToggleStep(task.id, step.id)}
              className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${
                step.done
                  ? 'border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/15'
                  : 'border-sky-400/40 text-sky-200 hover:bg-sky-500/10'
              }`}
            >
              {step.done ? 'Desmarcar' : 'Completar'}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-end">
        <button
          // Solo se habilita al 100% para respetar la regla de negocio.
          onClick={() => onFinishTask(task.id)}
          disabled={!isCompleted}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isCompleted ? <Check size={16} /> : <Trash2 size={16} />}
          Finalizar y Eliminar tarea
        </button>
      </div>
    </article>
  )
}

export default TaskCard
