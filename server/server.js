const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // สำคัญมาก: ต้องอยู่บนสุดเพื่อให้อ่านไฟล์ .env ได้

const app = express();

// --- Middleware (โจทย์ข้อ 2.2) ---
app.use(express.json());
app.use(cors()); 

// --- 1. ออกแบบ Schema (โจทย์ข้อ 2.1) ---
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Work', 'Personal', 'Study'], default: 'Personal' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, default: 'Pending' }
}, { timestamps: true }); // เพิ่ม timestamps เพื่อให้รู้ว่าสร้างเมื่อไหร่

const Task = mongoose.model('Task', taskSchema);

// --- 2. เชื่อมต่อฐานข้อมูล (โจทย์ข้อ 2.3) ---
// ดึงค่า MONGO_URI จากไฟล์ .env
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log("✅ เชื่อมต่อ MongoDB Atlas สำเร็จ (Cluster0)"))
  .catch(err => {
    console.log("❌ เชื่อมต่อผิดพลาด! กรุณาเช็ครหัสผ่านใน .env");
    console.error(err);
  });

// --- 3. API Routes (Project Requirements ส่วนที่ 0) ---

// ดึงข้อมูลทั้งหมด
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// เพิ่มงานใหม่
app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
  }
});

// สลับสถานะ (Real-time Status สลับ Pending/Completed)
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send("ไม่พบรายการ");
    
    task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ลบงาน (สำหรับจัดการข้อมูล)
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "ลบสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 4. รัน Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ของคุณพร้อมใช้งานที่พอร์ต ${PORT}`);
});