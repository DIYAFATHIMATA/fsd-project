import mongoose from 'mongoose';

const salesReturnSchema = new mongoose.Schema(
  {
    returnId: { type: String, required: true, trim: true, unique: true },
    customer: { type: String, required: true, trim: true },
    reason: { type: String, trim: true, default: '' },
    status: { type: String, default: 'Pending' }
  },
  { timestamps: true }
);

export default mongoose.model('SalesReturn', salesReturnSchema);
