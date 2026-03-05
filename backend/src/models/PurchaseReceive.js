import mongoose from 'mongoose';

const purchaseReceiveSchema = new mongoose.Schema(
  {
    receiveId: { type: String, required: true, trim: true, unique: true },
    date: { type: Date, default: Date.now },
    supplier: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('PurchaseReceive', purchaseReceiveSchema);
