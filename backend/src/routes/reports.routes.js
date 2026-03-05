import { Router } from 'express';
import Invoice from '../models/Invoice.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

const formatMonthKey = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const formatMonthLabel = (date) =>
  date.toLocaleString('en-IN', {
    month: 'short'
  });

router.get('/summary', async (_req, res) => {
  try {
    const [
      salesAgg,
      purchasesAgg,
      invoiceCount,
      purchaseOrderCount,
      productsCount,
      customersCount,
      lowStockCount,
      monthlySalesRaw
    ] = await Promise.all([
      Invoice.aggregate([
        {
          $group: {
            _id: null,
            totalSalesRevenue: { $sum: { $ifNull: ['$total', 0] } },
            totalGstCollected: { $sum: { $ifNull: ['$tax', 0] } }
          }
        }
      ]),
      PurchaseOrder.aggregate([
        {
          $group: {
            _id: null,
            totalPurchaseCost: { $sum: { $ifNull: ['$total', 0] } },
            totalGstPaid: { $sum: { $ifNull: ['$tax', 0] } }
          }
        }
      ]),
      Invoice.countDocuments(),
      PurchaseOrder.countDocuments(),
      Product.countDocuments(),
      Customer.countDocuments(),
      Product.countDocuments({ stock: { $lt: 10 } }),
      Invoice.aggregate([
        {
          $addFields: {
            effectiveDate: {
              $ifNull: ['$date', '$createdAt']
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$effectiveDate' },
              month: { $month: '$effectiveDate' }
            },
            value: { $sum: { $ifNull: ['$total', 0] } }
          }
        }
      ])
    ]);

    const sales = salesAgg[0] || {};
    const purchases = purchasesAgg[0] || {};

    const now = new Date();
    const monthPoints = [];
    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
      monthPoints.push({
        key: formatMonthKey(date),
        label: formatMonthLabel(date),
        value: 0
      });
    }

    const monthIndex = new Map(monthPoints.map((point) => [point.key, point]));

    for (const entry of monthlySalesRaw) {
      const month = String(entry?._id?.month || '').padStart(2, '0');
      const year = entry?._id?.year;
      const key = `${year}-${month}`;
      if (monthIndex.has(key)) {
        monthIndex.get(key).value = Number(entry.value || 0);
      }
    }

    const totalSalesRevenue = Number(sales.totalSalesRevenue || 0);
    const totalPurchaseCost = Number(purchases.totalPurchaseCost || 0);
    const totalGstCollected = Number(sales.totalGstCollected || 0);
    const totalGstPaid = Number(purchases.totalGstPaid || 0);

    return res.json({
      success: true,
      data: {
        totalSalesRevenue,
        totalPurchaseCost,
        totalGstCollected,
        totalGstPaid,
        netGst: totalGstCollected - totalGstPaid,
        invoiceCount,
        purchaseOrderCount,
        productsCount,
        customersCount,
        lowStockCount,
        monthlySalesTrend: monthPoints
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
