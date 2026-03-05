import Supplier from '../models/Supplier.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Expense from '../models/Expense.js';
import PurchaseReceive from '../models/PurchaseReceive.js';
import Bill from '../models/Bill.js';
import VendorPayment from '../models/VendorPayment.js';
import VendorCredit from '../models/VendorCredit.js';

const seedIfEmpty = async (Model, docs) => {
  const count = await Model.countDocuments();
  if (count > 0) {
    return;
  }
  await Model.insertMany(docs);
};

export const seedDedicatedPurchasesPages = async () => {
  await seedIfEmpty(Supplier, [
    { name: 'TechDistro India Pvt Ltd', contact: '9876543210', gst: '27AABCT3518Q1ZV', email: 'orders@techdistro.in', address: 'Mumbai, MH' },
    { name: 'Office Essentials Corp', contact: '9988776655', gst: '07AACCO1122F1ZX', email: 'sales@officeessentials.com', address: 'Delhi, DL' },
    { name: 'Global Logistix', contact: '8877665544', gst: '33AABCG9988L1ZA', email: 'support@globallogistix.com', address: 'Chennai, TN' }
  ]);

  const suppliers = await Supplier.find({}).lean();
  const supplierByName = new Map(suppliers.map((supplier) => [supplier.name, supplier]));

  await seedIfEmpty(PurchaseOrder, [
    {
      supplierId: supplierByName.get('TechDistro India Pvt Ltd')?._id,
      supplierName: 'TechDistro India Pvt Ltd',
      items: [{ name: 'Wireless Ergonomic Mouse', quantity: 50, costPrice: 800, gst: 18 }],
      subtotal: 40000,
      tax: 7200,
      total: 47200,
      date: '2023-10-10T00:00:00.000Z'
    },
    {
      supplierId: supplierByName.get('Office Essentials Corp')?._id,
      supplierName: 'Office Essentials Corp',
      items: [{ name: 'A4 Paper Ream (500 Sheets)', quantity: 200, costPrice: 180, gst: 12 }],
      subtotal: 36000,
      tax: 4320,
      total: 40320,
      date: '2023-10-15T00:00:00.000Z'
    }
  ]);

  await seedIfEmpty(Expense, [
    { date: '2023-10-01', category: 'Rent', amount: 25000, paidThrough: 'Bank Account' },
    { date: '2023-10-05', category: 'Office Supplies', amount: 1500, paidThrough: 'Petty Cash' },
    { date: '2023-10-15', category: 'Travel', amount: 4500, paidThrough: 'Bank Account' }
  ]);

  await seedIfEmpty(PurchaseReceive, [
    { receiveId: 'REC-001', date: '2023-09-15', supplier: 'TechDistro India Pvt Ltd', status: 'Received' },
    { receiveId: 'REC-002', date: '2023-10-12', supplier: 'Office Essentials Corp', status: 'Received' }
  ]);

  await seedIfEmpty(Bill, [
    { billId: 'BILL-9988', supplier: 'TechDistro India Pvt Ltd', amount: 45000, dueDate: '2023-11-01', status: 'Open' },
    { billId: 'BILL-4455', supplier: 'Office Essentials Corp', amount: 12500, dueDate: '2023-10-28', status: 'Paid' }
  ]);

  await seedIfEmpty(VendorPayment, [
    { paymentId: 'VPAY-001', supplier: 'Office Essentials Corp', amount: 5000, mode: 'Bank Transfer' },
    { paymentId: 'VPAY-002', supplier: 'TechDistro India Pvt Ltd', amount: 20000, mode: 'Cheque' }
  ]);

  await seedIfEmpty(VendorCredit, [
    { creditId: 'VCN-001', supplier: 'TechDistro India Pvt Ltd', amount: 2000 }
  ]);
};
