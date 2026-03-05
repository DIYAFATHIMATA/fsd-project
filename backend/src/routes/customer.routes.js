import { Router } from 'express';
import Customer from '../models/Customer.js';
import PaymentReceived from '../models/PaymentReceived.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (_req, res) => {
  try {
    const customers = await Customer.find({}).sort({ createdAt: -1 }).lean();

    const payments = await PaymentReceived.find({}, { customer: 1, amount: 1 }).lean();
    const paidAmountByCustomer = payments.reduce((acc, payment) => {
      const key = String(payment.customer || '').trim().toLowerCase();
      if (!key) {
        return acc;
      }

      acc[key] = Number(acc[key] || 0) + Number(payment.amount || 0);
      return acc;
    }, {});

    const customersWithReceivables = customers.map((customer) => {
      const key = String(customer.name || '').trim().toLowerCase();
      return {
        ...customer,
        receivables: Number(paidAmountByCustomer[key] || 0)
      };
    });

    return res.status(200).json({ success: true, data: customersWithReceivables });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }

    const customer = await Customer.create({
      name: String(name).trim(),
      email: email ? String(email).trim().toLowerCase() : '',
      phone: phone ? String(phone).trim() : '',
      address: address ? String(address).trim() : ''
    });

    return res.status(201).json({ success: true, data: customer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (name !== undefined) {
      const normalizedName = String(name).trim();
      if (normalizedName.length < 2) {
        return res.status(400).json({ success: false, message: 'Customer name is required' });
      }
      customer.name = normalizedName;
    }

    if (email !== undefined) {
      customer.email = String(email || '').trim().toLowerCase();
    }

    if (phone !== undefined) {
      customer.phone = String(phone || '').trim();
    }

    if (address !== undefined) {
      customer.address = String(address || '').trim();
    }

    await customer.save();

    return res.status(200).json({ success: true, data: customer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    return res.status(200).json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
