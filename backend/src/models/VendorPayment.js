import mongoose from 'mongoose';

const vendorPaymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true, trim: true, unique: true },
    supplier: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, default: 0 },
    mode: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('VendorPayment', vendorPaymentSchema);
