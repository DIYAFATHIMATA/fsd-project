import mongoose from 'mongoose';

const paymentReceivedSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true, trim: true, unique: true },
    invoiceId: { type: String, trim: true, default: '' },
    customer: { type: String, required: true, trim: true },
    products: { type: [mongoose.Schema.Types.Mixed], default: [] },
    productSummary: { type: String, trim: true, default: '' },
    amount: { type: Number, required: true, default: 0 },
    mode: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('PaymentReceived', paymentReceivedSchema);
