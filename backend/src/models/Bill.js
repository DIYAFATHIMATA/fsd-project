import mongoose from 'mongoose';

const billSchema = new mongoose.Schema(
  {
    billId: { type: String, required: true, trim: true, unique: true },
    supplier: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, default: 0 },
    dueDate: { type: Date },
    status: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('Bill', billSchema);
