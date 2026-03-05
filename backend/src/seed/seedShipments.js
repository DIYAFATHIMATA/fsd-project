import Shipment from '../models/Shipment.js';

const defaultShipments = [
  { shipmentNum: 'SHP-5001', carrier: 'BlueDart', tracking: '1234567890', status: 'In Transit' },
  { shipmentNum: 'SHP-5002', carrier: 'Delhivery', tracking: 'DLV9876543', status: 'Delivered' },
  { shipmentNum: 'SHP-5003', carrier: 'FedEx', tracking: 'FDX11223344', status: 'In Transit' }
];

export const seedShipments = async () => {
  const count = await Shipment.countDocuments();
  if (count > 0) {
    return;
  }

  await Shipment.insertMany(defaultShipments);
};
