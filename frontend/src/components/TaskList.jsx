import { updateTask, deleteTask } from '../api/tasks'

export default function TaskList({ tasks, onTasksChanged }) {
  async function handleToggle(task) {
    try {
      await updateTask(task.id, { completed: !task.completed })
      onTasksChanged()
    } catch (err) {
      console.error('Failed to update task', err)
    }
  }

  async function handleDelete(taskId) {
    try {
      await deleteTask(taskId)
      onTasksChanged()
    } catch (err) {
      console.error('Failed to delete task', err)
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-400">No tasks yet. Add one above.</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-gray-100">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center gap-3 py-3 group"
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggle(task)}
            className="accent-blue-600 w-4 h-4 cursor-pointer"
          />
          <span
            className={`flex-1 text-sm ${
              task.completed
                ? 'line-through text-gray-400'
                : 'text-gray-700'
            }`}
          >
            {task.title}
          </span>
          <button
            onClick={() => handleDelete(task.id)}
            className="text-xs text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}