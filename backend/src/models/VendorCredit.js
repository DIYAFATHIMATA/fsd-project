import mongoose from 'mongoose';

const vendorCreditSchema = new mongoose.Schema(
  {
    creditId: { type: String, required: true, trim: true, unique: true },
    supplier: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('VendorCredit', vendorCreditSchema);
