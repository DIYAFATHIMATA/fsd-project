import InventoryAdjustment from '../models/InventoryAdjustment.js';

const defaultAdjustments = [
  {
    reference: 'ADJ-001',
    reason: 'Stock Take Discrepancy',
    type: 'Quantity',
    description: 'Found 2 extra mice during audit',
    status: 'Adjusted'
  },
  {
    reference: 'ADJ-002',
    reason: 'Damaged Goods',
    type: 'Value',
    description: 'Water damage on box 4',
    status: 'Adjusted'
  },
  {
    reference: 'ADJ-003',
    reason: 'Damaged Goods',
    type: 'Quantity',
    description: 'Damaged in warehouse handling',
    status: 'Adjusted'
  }
];

export const seedInventoryAdjustments = async () => {
  const count = await InventoryAdjustment.countDocuments();
  if (count > 0) {
    return;
  }

  await InventoryAdjustment.insertMany(defaultAdjustments);
};
