import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, default: 0 },
    paidThrough: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);
