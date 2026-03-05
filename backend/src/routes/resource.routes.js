import { Router } from 'express';
import ResourceEntry from '../models/ResourceEntry.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import SalesOrder from '../models/SalesOrder.js';
import Invoice from '../models/Invoice.js';
import DeliveryChallan from '../models/DeliveryChallan.js';
import PaymentReceived from '../models/PaymentReceived.js';
import SalesReturn from '../models/SalesReturn.js';
import CreditNote from '../models/CreditNote.js';
import Supplier from '../models/Supplier.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Expense from '../models/Expense.js';
import PurchaseReceive from '../models/PurchaseReceive.js';
import Bill from '../models/Bill.js';
import VendorPayment from '../models/VendorPayment.js';
import VendorCredit from '../models/VendorCredit.js';
import Category from '../models/Category.js';

const router = Router();

const ALLOWED_KEYS = new Set([
  'ims_customers',
  'ims_sales_orders',
  'ims_sales',
  'ims_payments_received',
  'ims_returns',
  'ims_credit_notes',
  'ims_challans',
  'ims_categories',
  'ims_suppliers',
  'ims_purchases',
  'ims_expenses',
  'ims_receives',
  'ims_bills',
  'ims_vendor_payments',
  'ims_vendor_credits',
  'ims_adjustments'
]);

router.use(requireAuth);

const DEDICATED_MODEL_BY_KEY = {
  ims_sales_orders: SalesOrder,
  ims_sales: Invoice,
  ims_challans: DeliveryChallan,
  ims_payments_received: PaymentReceived,
  ims_returns: SalesReturn,
  ims_credit_notes: CreditNote,
  ims_suppliers: Supplier,
  ims_purchases: PurchaseOrder,
  ims_expenses: Expense,
  ims_receives: PurchaseReceive,
  ims_bills: Bill,
  ims_vendor_payments: VendorPayment,
  ims_vendor_credits: VendorCredit,
  ims_categories: Category
};

const ensureAllowedKey = (resourceKey, res) => {
  if (!ALLOWED_KEYS.has(resourceKey)) {
    res.status(400).json({ success: false, message: 'Unsupported resource key' });
    return false;
  }
  return true;
};

const toClientRecord = (doc) => ({
  _id: doc._id,
  ...doc.data,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt
});

const toClientFromDedicated = (doc) => ({
  _id: doc._id,
  ...doc,
  _id: doc._id,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt
});

router.get('/:resourceKey', async (req, res) => {
  try {
    const { resourceKey } = req.params;
    if (!ensureAllowedKey(resourceKey, res)) return;

    const DedicatedModel = DEDICATED_MODEL_BY_KEY[resourceKey];
    if (DedicatedModel) {
      const entries = await DedicatedModel.find({}).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, data: entries.map(toClientFromDedicated) });
    }

    const entries = await ResourceEntry.find({ resourceKey }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: entries.map(toClientRecord) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:resourceKey', async (req, res) => {
  try {
    const { resourceKey } = req.params;
    if (!ensureAllowedKey(resourceKey, res)) return;

    const DedicatedModel = DEDICATED_MODEL_BY_KEY[resourceKey];
    if (DedicatedModel) {
      const created = await DedicatedModel.create(req.body || {});
      return res.status(201).json({ success: true, data: toClientFromDedicated(created.toObject()) });
    }

    const created = await ResourceEntry.create({
      resourceKey,
      data: req.body || {}
    });

    return res.status(201).json({ success: true, data: toClientRecord(created) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:resourceKey/:id', async (req, res) => {
  try {
    const { resourceKey, id } = req.params;
    if (!ensureAllowedKey(resourceKey, res)) return;

    const DedicatedModel = DEDICATED_MODEL_BY_KEY[resourceKey];
    if (DedicatedModel) {
      const updated = await DedicatedModel.findByIdAndUpdate(
        id,
        { $set: req.body || {} },
        { new: true, runValidators: true }
      ).lean();

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }

      return res.status(200).json({ success: true, data: toClientFromDedicated(updated) });
    }

    const existing = await ResourceEntry.findOne({ _id: id, resourceKey });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    existing.data = { ...existing.data, ...(req.body || {}) };
    await existing.save();

    return res.status(200).json({ success: true, data: toClientRecord(existing) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:resourceKey/:id', async (req, res) => {
  try {
    const { resourceKey, id } = req.params;
    if (!ensureAllowedKey(resourceKey, res)) return;

    const DedicatedModel = DEDICATED_MODEL_BY_KEY[resourceKey];
    if (DedicatedModel) {
      const deleted = await DedicatedModel.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }

      return res.status(200).json({ success: true, message: 'Record deleted' });
    }

    const deleted = await ResourceEntry.findOneAndDelete({ _id: id, resourceKey });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    return res.status(200).json({ success: true, message: 'Record deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
