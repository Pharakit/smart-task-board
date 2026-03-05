import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL + '/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post(API_URL, { title, category, priority });
      setTitle('');
      fetchTasks();
    } catch (err) { console.error("Add error:", err); }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`);
      fetchTasks();
    } catch (err) { console.error("Toggle error:", err); }
  };

  return (
    <div className="container">
      <header>
        <h1>📑 Smart Task Board</h1>
        <p className="subtitle">Management System by Pharakit</p>
      </header>
      
      <form onSubmit={addTask} className="task-form">
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="What needs to be done?" 
          required 
        />
        <div className="form-group">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button type="submit" className="btn-add">Add Task</button>
        </div>
      </form>

      <div className="task-list">
        {tasks.map(task => (
          <div key={task._id} className={`task-item ${task.status.toLowerCase()}`}>
            <div className="task-info">
              <span className={`badge ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              <div className="task-text">
                <span className="cat-label">[{task.category}]</span>
                <span className="title-text">{task.title}</span>
              </div>
            </div>
            <button 
              onClick={() => toggleStatus(task._id)}
              className={`status-btn ${task.status === 'Completed' ? 'done' : ''}`}
            >
              {task.status}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;