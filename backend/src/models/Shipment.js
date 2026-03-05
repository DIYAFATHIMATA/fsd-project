import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema(
  {
    shipmentNum: {
      type: String,
      required: true,
      trim: true
    },
    carrier: {
      type: String,
      required: true,
      trim: true
    },
    tracking: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['In Transit', 'Out for Delivery', 'Delivered'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

shipmentSchema.index({ shipmentNum: 1 }, { unique: true });
shipmentSchema.index({ tracking: 1 }, { unique: true });

export default mongoose.model('Shipment', shipmentSchema);
