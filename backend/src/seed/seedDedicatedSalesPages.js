import SalesOrder from '../models/SalesOrder.js';
import Invoice from '../models/Invoice.js';
import DeliveryChallan from '../models/DeliveryChallan.js';
import PaymentReceived from '../models/PaymentReceived.js';
import SalesReturn from '../models/SalesReturn.js';
import CreditNote from '../models/CreditNote.js';

const seedIfEmpty = async (Model, docs) => {
  const count = await Model.countDocuments();
  if (count > 0) {
    return;
  }
  await Model.insertMany(docs);
};

export const seedDedicatedSalesPages = async () => {
  await seedIfEmpty(SalesOrder, [
    { orderId: 'SO-2023-001', customerName: 'Acme Corp', total: 15450, date: '2023-10-20', status: 'Confirmed', items: [] },
    { orderId: 'SO-2023-002', customerName: 'Rahul Sharma', total: 2499, date: '2023-10-22', status: 'Confirmed', items: [] },
    { orderId: 'SO-2023-003', customerName: 'Tech Solutions Ltd', total: 125000, date: '2023-10-25', status: 'Confirmed', items: [] }
  ]);

  await seedIfEmpty(Invoice, [
    { invoiceId: 'INV-2023-001', customerName: 'Acme Corp', total: 15450, date: '2023-10-20', status: 'Paid', items: [] },
    { invoiceId: 'INV-2023-002', customerName: 'Rahul Sharma', total: 2499, date: '2023-10-22', status: 'Paid', items: [] },
    { invoiceId: 'INV-2023-003', customerName: 'Tech Solutions Ltd', total: 125000, date: '2023-10-25', status: 'Paid', items: [] },
    { invoiceId: 'INV-2023-004', customerName: 'Priya Singh', total: 8999, date: '2023-10-26', status: 'Paid', items: [] }
  ]);

  await seedIfEmpty(DeliveryChallan, [
    { challanId: 'DC-001', customer: 'Acme Corp', date: '2023-10-20', status: 'Delivered' },
    { challanId: 'DC-002', customer: 'Tech Solutions Ltd', date: '2023-10-24', status: 'In Transit' }
  ]);

  await seedIfEmpty(PaymentReceived, [
    { paymentId: 'PAY-8001', customer: 'Acme Corp', amount: 15450, mode: 'Bank Transfer' },
    { paymentId: 'PAY-8002', customer: 'Rahul Sharma', amount: 2499, mode: 'UPI' },
    { paymentId: 'PAY-8003', customer: 'Tech Solutions Ltd', amount: 50000, mode: 'Cheque' },
    { paymentId: 'PAY-8004', customer: 'Tech Solutions Ltd', amount: 75000, mode: 'Bank Transfer' }
  ]);

  await seedIfEmpty(SalesReturn, [
    { returnId: 'RET-001', customer: 'Rahul Sharma', reason: 'Defective loading port', status: 'Received' },
    { returnId: 'RET-002', customer: 'Acme Corp', reason: 'Wrong Color Shipped', status: 'Pending' }
  ]);

  await seedIfEmpty(CreditNote, [
    { noteId: 'CN-001', customer: 'Rahul Sharma', amount: 2499 },
    { noteId: 'CN-002', customer: 'Acme Corp', amount: 5000 }
  ]);
};
