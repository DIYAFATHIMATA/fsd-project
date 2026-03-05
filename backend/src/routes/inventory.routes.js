import { Router } from 'express';
import Product from '../models/Product.js';
import StockTransaction from '../models/StockTransaction.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/items', async (_req, res) => {
  try {
    const items = await Product.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/items', async (req, res) => {
  try {
    const { name, category, price, costPrice, stock, gst, sku } = req.body;

    if (!name || !category || sku === undefined) {
      return res.status(400).json({ success: false, message: 'name, category and sku are required' });
    }

    const existing = await Product.findOne({ sku: String(sku).toUpperCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'SKU already exists' });
    }

    const item = await Product.create({
      name: String(name).trim(),
      category: String(category).trim(),
      price: Number(price),
      costPrice: Number(costPrice),
      stock: Number(stock),
      gst: Number(gst),
      sku: String(sku).trim().toUpperCase()
    });

    if (item.stock > 0) {
      await StockTransaction.create({
        productId: item._id,
        productName: item.name,
        type: 'IN',
        quantity: item.stock,
        reference: 'Opening Stock'
      });
    }

    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Product.findById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const nextValues = {
      name: req.body.name !== undefined ? String(req.body.name).trim() : existing.name,
      category: req.body.category !== undefined ? String(req.body.category).trim() : existing.category,
      price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
      costPrice: req.body.costPrice !== undefined ? Number(req.body.costPrice) : existing.costPrice,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
      gst: req.body.gst !== undefined ? Number(req.body.gst) : existing.gst,
      sku: req.body.sku !== undefined ? String(req.body.sku).trim().toUpperCase() : existing.sku
    };

    if (nextValues.sku !== existing.sku) {
      const duplicate = await Product.findOne({ sku: nextValues.sku, _id: { $ne: id } });
      if (duplicate) {
        return res.status(409).json({ success: false, message: 'SKU already exists' });
      }
    }

    const stockDiff = nextValues.stock - existing.stock;

    existing.name = nextValues.name;
    existing.category = nextValues.category;
    existing.price = nextValues.price;
    existing.costPrice = nextValues.costPrice;
    existing.stock = nextValues.stock;
    existing.gst = nextValues.gst;
    existing.sku = nextValues.sku;

    await existing.save();

    if (stockDiff !== 0) {
      await StockTransaction.create({
        productId: existing._id,
        productName: existing.name,
        type: stockDiff > 0 ? 'IN' : 'OUT',
        quantity: Math.abs(stockDiff),
        reference: 'Manual Edit'
      });
    }

    return res.status(200).json({ success: true, data: existing });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Product.findById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    await Product.findByIdAndDelete(id);

    if (existing.stock > 0) {
      await StockTransaction.create({
        productId: existing._id,
        productName: existing.name,
        type: 'OUT',
        quantity: existing.stock,
        reference: 'Deleted Item'
      });
    }

    return res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stock-transactions', async (req, res) => {
  try {
    const limit = Number(req.query.limit || 8);
    const txns = await StockTransaction.find({}).sort({ timestamp: -1 }).limit(limit).lean();
    return res.status(200).json({ success: true, data: txns });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
