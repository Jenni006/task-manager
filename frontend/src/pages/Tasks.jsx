import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { fetchTasks, createTask } from '../api/tasks'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const limit = 10

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, limit }
      if (filter === 'active') params.completed = false
      if (filter === 'completed') params.completed = true
      const data = await fetchTasks(params)
      setTasks(data.tasks)
      setTotal(data.total)
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [filter, page])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  async function handleTaskCreated(taskData) {
    await createTask(taskData)
    setPage(1)
    setFilter('all')
    await loadTasks()
  }

  const totalPages = Math.ceil(total / limit)

  const activeCount = filter === 'all'
    ? tasks.filter(t => !t.completed).length
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">My Tasks</h2>
            {activeCount !== null && (
              <p className="text-xs text-gray-400 mt-0.5">
                {activeCount} remaining
              </p>
            )}
          </div>

          <div className="flex gap-1">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1) }}
                className={`text-xs px-3 py-1.5 rounded transition-colors capitalize ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg px-4 py-4">
          <TaskForm onTaskCreated={handleTaskCreated} />

          {error && (
            <p className="text-sm text-red-600 mb-3">{error}</p>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-400">Loading...</p>
            </div>
          ) : (
            <TaskList tasks={tasks} onTasksChanged={loadTasks} />
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-30 transition-colors"
            >
              ← Previous
            </button>
            <span className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-30 transition-colors"
            >
              Next →
            </button>
          </div>
        )}

      </main>
    </div>
  )
}