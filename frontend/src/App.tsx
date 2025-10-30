// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App



import { useState, useEffect,useMemo, type FormEvent } from 'react';
import * as api from './api'; 
import type { TaskItem } from './api'; 
import './App.css'; 
import { Plus, Trash2, Check, Circle } from 'lucide-react'; 

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#4A90E2"/>
    <path d="M12 20.5L17.5 26L28.5 15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all'); 


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };


  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault(); 
    if (!newTaskDesc.trim()) return; 

    try {
      const response = await api.addTask(newTaskDesc);
      setTasks([...tasks, response.data]); 
      setNewTaskDesc(''); 
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };


  const handleToggleComplete = async (taskToToggle: TaskItem) => {
    try {
      const updatedTask = { ...taskToToggle, isCompleted: !taskToToggle.isCompleted };
      await api.updateTask(taskToToggle.id, updatedTask);

      setTasks(tasks.map(t => 
        t.id === taskToToggle.id ? updatedTask : t
      ));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  
  const handleDeleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Right before the `return ( ... )`
const filteredTasks = useMemo(() => {
  return tasks.filter(task => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true; 
  });
}, [tasks, filter]); 

  return (
    <div className="app-container">
      <main className="task-manager-card">
        <header>
          <Logo />
        </header>

        <form className="add-task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Add new task..."
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
          />
          <button type="submit">
            <Plus size={20} /> Add Task
          </button>
        </form>

        <div className="filter-controls">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <section className="task-list-section">
          <h2>ALL TASKS</h2>
          <ul>
            {filteredTasks.map(task => (
              <li key={task.id} className={task.isCompleted ? 'completed' : ''}>
                <button 
                  className="task-toggle-button" 
                  onClick={() => handleToggleComplete(task)}
                  aria-label="Toggle task"
                >
                  {task.isCompleted ? <Check size={20} className="icon-check" /> : <Circle size={20} className="icon-circle" />}
                </button>

                <span className="task-description">
                  {task.description}
                </span>

                <button 
                  className="task-delete-button" 
                  onClick={() => handleDeleteTask(task.id)}
                  aria-label="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;