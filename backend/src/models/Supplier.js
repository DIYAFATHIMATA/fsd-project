import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contact: { type: String, trim: true, default: '' },
    gst: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    address: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

supplierSchema.index({ name: 1 });

export default mongoose.model('Supplier', supplierSchema);
