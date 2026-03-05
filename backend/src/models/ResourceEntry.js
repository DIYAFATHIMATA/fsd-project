import mongoose from 'mongoose';

const resourceEntrySchema = new mongoose.Schema(
  {
    resourceKey: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true
  }
);

resourceEntrySchema.index({ resourceKey: 1, createdAt: -1 });

export default mongoose.model('ResourceEntry', resourceEntrySchema);
