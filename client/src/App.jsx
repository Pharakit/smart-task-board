import { useState, useEffect } from 'react';
import axios from 'axios';

// ดึง URL ของ Server จากไฟล์ .env
const API_URL = import.meta.env.VITE_API_URL + '/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');

  // ดึงข้อมูลจากฐานข้อมูลทันทีที่เปิดหน้าเว็บ (โจทย์ข้อ 0.4)
  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) { console.error("ดึงข้อมูลไม่สำเร็จ", err); }
  };

  const addTask = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, { title, category, priority });
    setTitle(''); // ล้างช่องพิมพ์
    fetchTasks(); // อัปเดตรายการใหม่ทันที
  };

  const toggleStatus = async (id) => {
    await axios.put(`${API_URL}/${id}`);
    fetchTasks(); // โจทย์ข้อ 0.3: สลับสถานะ Real-time
  };

  // โจทย์ข้อ 0.2: แสดงสีที่ต่างกันตาม Priority
  const getPriorityStyle = (p) => {
    if (p === 'High') return { backgroundColor: '#ff4d4d', color: 'white' };
    if (p === 'Medium') return { backgroundColor: '#ffa500', color: 'black' };
    return { backgroundColor: '#2ecc71', color: 'white' };
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>📑 Smart Task Board</h1>
      
      <form onSubmit={addTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="ชื่อกิจกรรม..." 
          required 
        />
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
        </select>
        <select onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button type="submit">เพิ่ม</button>
      </form>

      {tasks.map(task => (
        <div key={task._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ ...getPriorityStyle(task.priority), padding: '2px 8px', borderRadius: '4px', fontSize: '12px', marginRight: '10px' }}>
              {task.priority}
            </span>
            <strong>[{task.category}]</strong> {task.title}
          </div>
          <button 
            onClick={() => toggleStatus(task._id)}
            style={{ cursor: 'pointer', backgroundColor: task.status === 'Completed' ? '#ddd' : '#eee' }}
          >
            {task.status}
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;