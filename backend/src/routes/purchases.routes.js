import { Router } from 'express';
import Product from '../models/Product.js';
import Supplier from '../models/Supplier.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import StockTransaction from '../models/StockTransaction.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/record', async (req, res) => {
  try {
    const { supplierId, items } = req.body;

    if (!supplierId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'supplierId and items are required' });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(400).json({ success: false, message: 'Supplier not found' });
    }

    const productIds = items.map((item) => item._id || item.id || item.productId).filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    let subtotal = 0;
    let tax = 0;

    for (const item of items) {
      const productId = String(item._id || item.id || item.productId || '');
      const quantity = Number(item.quantity) || 0;
      const product = productMap.get(productId);

      if (!product) {
        return res.status(400).json({ success: false, message: 'One or more products not found' });
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid quantity in items' });
      }

      const unitCost = Number(item.costPrice) || Number(product.costPrice) || 0;
      const gstRate = Number(item.gst ?? product.gst ?? 0);
      const taxable = unitCost * quantity;
      const itemTax = (taxable * gstRate) / 100;
      subtotal += taxable;
      tax += itemTax;
    }

    const total = subtotal + tax;

    for (const item of items) {
      const productId = String(item._id || item.id || item.productId);
      const quantity = Number(item.quantity);
      const product = productMap.get(productId);
      const unitCost = Number(item.costPrice) || Number(product.costPrice) || 0;

      product.stock = Number(product.stock) + quantity;
      product.costPrice = unitCost;
      await product.save();

      await StockTransaction.create({
        productId: product._id,
        productName: product.name,
        type: 'IN',
        quantity,
        reference: `PUR-${Date.now().toString().slice(-6)}`
      });
    }

    const purchaseData = {
      supplierId,
      supplierName: supplier.name || 'Unknown Supplier',
      items: items.map((item) => ({
        _id: item._id || item.id || item.productId,
        name: item.name,
        quantity: Number(item.quantity),
        costPrice: Number(item.costPrice),
        gst: Number(item.gst || 0)
      })),
      subtotal,
      tax,
      total,
      date: new Date().toISOString()
    };

    const created = await PurchaseOrder.create(purchaseData);

    return res.status(201).json({
      success: true,
      data: {
        _id: created._id,
        ...created.toObject(),
        createdAt: created.createdAt,
        updatedAt: created.updatedAt
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
