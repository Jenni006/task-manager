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
  const remainingCount = tasks.filter(t => !t.completed).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-800">My Tasks</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {total === 0
                ? 'No tasks yet'
                : `${remainingCount} of ${total} remaining`}
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1) }}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors capitalize ${
                  filter === f
                    ? 'bg-white text-gray-800 shadow-sm font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-5 shadow-sm">
          <TaskForm onTaskCreated={handleTaskCreated} />

          <div className="border-t border-gray-100 -mx-5 mb-1" />

          {error && (
            <p className="text-sm text-red-500 mt-3">{error}</p>
          )}

          {loading ? (
            <div className="text-center py-14">
              <p className="text-sm text-gray-300">Loading...</p>
            </div>
          ) : (
            <TaskList tasks={tasks} onTasksChanged={loadTasks} />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
            >
              ← Previous
            </button>
            <span className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
            >
              Next →
            </button>
          </div>
        )}

      </main>
    </div>
  )
}