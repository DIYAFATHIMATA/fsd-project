import { Router } from 'express';
import Product from '../models/Product.js';
import StockTransaction from '../models/StockTransaction.js';
import SalesOrder from '../models/SalesOrder.js';
import Invoice from '../models/Invoice.js';
import PaymentReceived from '../models/PaymentReceived.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/checkout', async (req, res) => {
  try {
    const { customerName, items, paymentMode } = req.body;

    if (!customerName || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'customerName and items are required' });
    }

    const productIds = items.map((item) => item._id || item.id).filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    let subtotal = 0;
    let tax = 0;

    for (const item of items) {
      const productId = String(item._id || item.id || '');
      const quantity = Number(item.quantity) || 0;
      const product = productMap.get(productId);

      if (!product) {
        return res.status(400).json({ success: false, message: 'One or more products not found' });
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid item quantity' });
      }

      if (quantity > Number(product.stock)) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      const taxable = Number(product.price) * quantity;
      const itemTax = (taxable * Number(product.gst || 0)) / 100;
      subtotal += taxable;
      tax += itemTax;
    }

    const total = subtotal + tax;
    const orderId = `SO-${Date.now().toString().slice(-6)}`;
    const invoiceId = `INV-${Date.now().toString().slice(-6)}`;

    for (const item of items) {
      const productId = String(item._id || item.id);
      const quantity = Number(item.quantity);
      const product = productMap.get(productId);

      product.stock = Number(product.stock) - quantity;
      await product.save();

      await StockTransaction.create({
        productId: product._id,
        productName: product.name,
        type: 'OUT',
        quantity,
        reference: invoiceId
      });
    }

    const invoiceData = {
      invoiceId,
      customerName: customerName.trim(),
      subtotal,
      tax,
      total,
      status: 'Paid',
      date: new Date().toISOString(),
      items: items.map((item) => ({
        _id: item._id || item.id,
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price),
        gst: Number(item.gst)
      }))
    };

    const salesOrderData = {
      orderId,
      customerName: customerName.trim(),
      subtotal,
      tax,
      total,
      status: 'Confirmed',
      date: new Date().toISOString(),
      items: invoiceData.items
    };

    await SalesOrder.create(salesOrderData);

    await Invoice.create(invoiceData);

    await PaymentReceived.create({
      paymentId: `PAY-${Date.now().toString().slice(-6)}`,
      invoiceId,
      customer: customerName.trim(),
      products: invoiceData.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      productSummary: invoiceData.items.map((item) => `${item.name} x${item.quantity}`).join(', '),
      amount: total,
      mode: typeof paymentMode === 'string' && paymentMode.trim() ? paymentMode.trim() : 'Cash',
      date: new Date().toISOString()
    });

    return res.status(201).json({ success: true, data: invoiceData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
