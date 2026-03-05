import { Router } from 'express';
import Shipment from '../models/Shipment.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (_req, res) => {
  try {
    const records = await Shipment.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { shipmentNum, carrier, tracking, status } = req.body;

    if (!shipmentNum || !carrier || !tracking || !status) {
      return res.status(400).json({ success: false, message: 'shipmentNum, carrier, tracking and status are required' });
    }

    const normalizedShipmentNum = String(shipmentNum).trim();
    const normalizedTracking = String(tracking).trim();

    const duplicateShipmentNum = await Shipment.findOne({ shipmentNum: normalizedShipmentNum });
    if (duplicateShipmentNum) {
      return res.status(409).json({ success: false, message: 'Shipment number already exists' });
    }

    const duplicateTracking = await Shipment.findOne({ tracking: normalizedTracking });
    if (duplicateTracking) {
      return res.status(409).json({ success: false, message: 'Tracking number already exists' });
    }

    const created = await Shipment.create({
      shipmentNum: normalizedShipmentNum,
      carrier: String(carrier).trim(),
      tracking: normalizedTracking,
      status: String(status).trim()
    });

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { shipmentNum, carrier, tracking, status } = req.body;

    const record = await Shipment.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (shipmentNum !== undefined) {
      const normalizedShipmentNum = String(shipmentNum).trim();
      const duplicateShipmentNum = await Shipment.findOne({
        shipmentNum: normalizedShipmentNum,
        _id: { $ne: id }
      });
      if (duplicateShipmentNum) {
        return res.status(409).json({ success: false, message: 'Shipment number already exists' });
      }
      record.shipmentNum = normalizedShipmentNum;
    }

    if (carrier !== undefined) {
      record.carrier = String(carrier).trim();
    }

    if (tracking !== undefined) {
      const normalizedTracking = String(tracking).trim();
      const duplicateTracking = await Shipment.findOne({
        tracking: normalizedTracking,
        _id: { $ne: id }
      });
      if (duplicateTracking) {
        return res.status(409).json({ success: false, message: 'Tracking number already exists' });
      }
      record.tracking = normalizedTracking;
    }

    if (status !== undefined) {
      record.status = String(status).trim();
    }

    await record.save();

    return res.status(200).json({ success: true, data: record });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Shipment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    return res.status(200).json({ success: true, message: 'Shipment deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
