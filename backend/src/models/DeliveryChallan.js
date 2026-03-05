import mongoose from 'mongoose';

const deliveryChallanSchema = new mongoose.Schema(
  {
    challanId: { type: String, required: true, trim: true, unique: true },
    customer: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Delivered' }
  },
  { timestamps: true }
);

export default mongoose.model('DeliveryChallan', deliveryChallanSchema);
