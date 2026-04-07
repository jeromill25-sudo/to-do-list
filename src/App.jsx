
import { useEffect, useMemo, useState } from 'react'
import { CheckSquare, ListTodo, LogOut, User } from 'lucide-react'
import UserGate from './components/UserGate'
import TaskForm from './components/TaskForm'
import TaskCard from './components/TaskCard'

const STORAGE_KEY = 'todo-pro-users'
const ACTIVE_USER_KEY = 'todo-pro-active-user'

function App() {
  const [activeUser, setActiveUser] = useState('')
  const [tasksByUser, setTasksByUser] = useState({})

  useEffect(() => {
    // Carga inicial: recupera usuario activo y todas las tareas guardadas por usuario.
    const savedUser = localStorage.getItem(ACTIVE_USER_KEY) ?? ''
    const savedTasks = localStorage.getItem(STORAGE_KEY)

    setActiveUser(savedUser)
    setTasksByUser(savedTasks ? JSON.parse(savedTasks) : {})
  }, [])

  useEffect(() => {
    // Persistencia global: cada cambio en tareas se guarda en localStorage.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksByUser))
  }, [tasksByUser])

  useEffect(() => {
    // Persistencia de sesion local: recuerda quien es el usuario actual.
    if (activeUser) {
      localStorage.setItem(ACTIVE_USER_KEY, activeUser)
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY)
    }
  }, [activeUser])

  // Devuelve solo las tareas del usuario activo para aislar "cuentas" por nombre.
  const userTasks = useMemo(() => tasksByUser[activeUser] ?? [], [activeUser, tasksByUser])

  const handleSetUser = (username) => {
    setActiveUser(username)
    setTasksByUser((prev) => {
      // Si el usuario entra por primera vez, crea su espacio de tareas vacio.
      if (prev[username]) return prev
      return { ...prev, [username]: [] }
    })
  }

  const handleLogout = () => {
    setActiveUser('')
  }

  const handleAddTask = (taskDraft) => {
    // Crea una tarea con IDs unicos y todos los sub-pasos en estado pendiente.
    const newTask = {
      id: crypto.randomUUID(),
      title: taskDraft.title,
      steps: taskDraft.steps.map((step) => ({
        id: crypto.randomUUID(),
        text: step,
        done: false,
      })),
      createdAt: Date.now(),
    }

    setTasksByUser((prev) => ({
      ...prev,
      [activeUser]: [newTask, ...(prev[activeUser] ?? [])],
    }))
  }

  const handleToggleStep = (taskId, stepId) => {
    // Marca/desmarca un sub-paso sin modificar el resto de tareas/sub-pasos.
    setTasksByUser((prev) => ({
      ...prev,
      [activeUser]: (prev[activeUser] ?? []).map((task) => {
        if (task.id !== taskId) return task
        return {
          ...task,
          steps: task.steps.map((step) => (step.id === stepId ? { ...step, done: !step.done } : step)),
        }
      }),
    }))
  }

  const handleFinishTask = (taskId) => {
    // Elimina una tarea finalizada (solo se habilita en UI cuando llega al 100%).
    setTasksByUser((prev) => ({
      ...prev,
      [activeUser]: (prev[activeUser] ?? []).filter((task) => task.id !== taskId),
    }))
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {!activeUser ? (
        <UserGate onSetUser={handleSetUser} />
      ) : (
        <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
                  <CheckSquare size={14} />
                  Lista de Tareas Pro
                </p>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Tus tareas, bajo control</h1>
                <p className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <User size={16} />
                  Usuario activo: <span className="font-semibold text-slate-100">{activeUser}</span>
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-rose-400 hover:text-rose-300"
              >
                <LogOut size={16} />
                Cambiar usuario
              </button>
            </div>
          </header>

          <TaskForm onAddTask={handleAddTask} />

          <div className="mt-8 space-y-4">
            {userTasks.length === 0 ? (
              <article className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center">
                <ListTodo className="mx-auto mb-3 text-slate-500" />
                <h2 className="text-lg font-semibold">No hay tareas para este usuario</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Crea una tarea con sub-pasos para comenzar a medir tu progreso.
                </p>
              </article>
            ) : (
              userTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStep={handleToggleStep}
                  onFinishTask={handleFinishTask}
                />
              ))
            )}
          </div>
        </section>
      )}
    </main>
  )
}

export default App
