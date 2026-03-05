import mongoose from 'mongoose';

const inventoryAdjustmentSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      trim: true
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Quantity', 'Value'],
      required: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      trim: true,
      default: 'Adjusted'
    }
  },
  {
    timestamps: true
  }
);

inventoryAdjustmentSchema.index({ reference: 1 }, { unique: true });

export default mongoose.model('InventoryAdjustment', inventoryAdjustmentSchema);
