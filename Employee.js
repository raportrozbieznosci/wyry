// models/Employee.js
import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true }, // Możesz zmienić typ na Date, jeśli chcesz
});

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
