import { Router } from 'express';
import InventoryAdjustment from '../models/InventoryAdjustment.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (_req, res) => {
  try {
    const records = await InventoryAdjustment.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { reference, reason, type, description, status } = req.body;

    if (!reference || !reason || !type) {
      return res.status(400).json({ success: false, message: 'reference, reason and type are required' });
    }

    const exists = await InventoryAdjustment.findOne({ reference: String(reference).trim() });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Reference already exists' });
    }

    const created = await InventoryAdjustment.create({
      reference: String(reference).trim(),
      reason: String(reason).trim(),
      type: String(type).trim(),
      description: description ? String(description).trim() : '',
      status: status ? String(status).trim() : 'Adjusted'
    });

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reference, reason, type, description, status } = req.body;

    const record = await InventoryAdjustment.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Adjustment not found' });
    }

    if (reference !== undefined) {
      const normalizedReference = String(reference).trim();
      const duplicate = await InventoryAdjustment.findOne({
        reference: normalizedReference,
        _id: { $ne: id }
      });
      if (duplicate) {
        return res.status(409).json({ success: false, message: 'Reference already exists' });
      }
      record.reference = normalizedReference;
    }

    if (reason !== undefined) {
      record.reason = String(reason).trim();
    }

    if (type !== undefined) {
      record.type = String(type).trim();
    }

    if (description !== undefined) {
      record.description = String(description || '').trim();
    }

    if (status !== undefined) {
      record.status = String(status || '').trim();
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
    const deleted = await InventoryAdjustment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Adjustment not found' });
    }

    return res.status(200).json({ success: true, message: 'Adjustment deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
