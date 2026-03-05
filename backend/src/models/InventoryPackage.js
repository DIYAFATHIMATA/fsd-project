import mongoose from 'mongoose';

const inventoryPackageSchema = new mongoose.Schema(
  {
    packageNum: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['Packed', 'Shipped', 'Delivered'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

inventoryPackageSchema.index({ packageNum: 1 }, { unique: true });

export default mongoose.model('InventoryPackage', inventoryPackageSchema);
