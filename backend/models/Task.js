import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Pending' }
}, { 
  timestamps: true // 👈 This MUST be plural 'timestamps' with an 's'
});

// Check that 'Task' matches the exact import name used in your controller
const Task = mongoose.model('Task', taskSchema);
export default Task;