import { useState } from 'react'

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError('')
    try {
      await onTaskCreated({ title: title.trim() })
      setTitle('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="bg-blue-600 text-white text-sm rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-40 transition-colors"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
      {error && (
        <p className="text-xs text-red-600 mt-1.5">{error}</p>
      )}
    </div>
  )
}