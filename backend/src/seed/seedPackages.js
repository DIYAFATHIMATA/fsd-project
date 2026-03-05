import InventoryPackage from '../models/InventoryPackage.js';

const defaultPackages = [
  { packageNum: 'PKG-1001', status: 'Shipped' },
  { packageNum: 'PKG-1002', status: 'Packed' },
  { packageNum: 'PKG-1003', status: 'Delivered' },
  { packageNum: 'PKG-1004', status: 'Packed' }
];

export const seedPackages = async () => {
  const count = await InventoryPackage.countDocuments();
  if (count > 0) {
    return;
  }

  await InventoryPackage.insertMany(defaultPackages);
};
