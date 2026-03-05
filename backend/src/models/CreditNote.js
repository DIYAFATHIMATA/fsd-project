import mongoose from 'mongoose';

const creditNoteSchema = new mongoose.Schema(
  {
    noteId: { type: String, required: true, trim: true, unique: true },
    customer: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('CreditNote', creditNoteSchema);
