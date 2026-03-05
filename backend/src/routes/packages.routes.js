import { Router } from 'express';
import InventoryPackage from '../models/InventoryPackage.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (_req, res) => {
  try {
    const records = await InventoryPackage.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { packageNum, status } = req.body;

    if (!packageNum || !status) {
      return res.status(400).json({ success: false, message: 'packageNum and status are required' });
    }

    const normalizedPackageNum = String(packageNum).trim();
    const exists = await InventoryPackage.findOne({ packageNum: normalizedPackageNum });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Package number already exists' });
    }

    const created = await InventoryPackage.create({
      packageNum: normalizedPackageNum,
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
    const { packageNum, status } = req.body;

    const record = await InventoryPackage.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    if (packageNum !== undefined) {
      const normalizedPackageNum = String(packageNum).trim();
      const duplicate = await InventoryPackage.findOne({
        packageNum: normalizedPackageNum,
        _id: { $ne: id }
      });
      if (duplicate) {
        return res.status(409).json({ success: false, message: 'Package number already exists' });
      }
      record.packageNum = normalizedPackageNum;
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
    const deleted = await InventoryPackage.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    return res.status(200).json({ success: true, message: 'Package deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
