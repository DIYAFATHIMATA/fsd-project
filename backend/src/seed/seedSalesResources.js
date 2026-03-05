import ResourceEntry from '../models/ResourceEntry.js';

const seedData = {
  ims_customers: [
    { name: 'Acme Corp', email: 'contact@acme.com', phone: '022-1234567', address: 'Business Bay, Pune' },
    { name: 'Rahul Sharma', email: 'rahul.s@gmail.com', phone: '9876500001', address: 'Indiranagar, Bangalore' },
    { name: 'Tech Solutions Ltd', email: 'procurement@techsol.com', phone: '080-4567890', address: 'Cyber City, Gurgaon' },
    { name: 'Priya Singh', email: 'priya.singh@design.studio', phone: '9900112233', address: 'Bandra, Mumbai' }
  ],
  ims_sales_orders: [
    { orderId: 'SO-2023-001', customerName: 'Acme Corp', total: 15450, date: '2023-10-20', status: 'Confirmed', items: [] },
    { orderId: 'SO-2023-002', customerName: 'Rahul Sharma', total: 2499, date: '2023-10-22', status: 'Confirmed', items: [] },
    { orderId: 'SO-2023-003', customerName: 'Tech Solutions Ltd', total: 125000, date: '2023-10-25', status: 'Confirmed', items: [] }
  ],
  ims_sales: [
    { invoiceId: 'INV-2023-001', customerName: 'Acme Corp', total: 15450, date: '2023-10-20', status: 'Paid', items: [] },
    { invoiceId: 'INV-2023-002', customerName: 'Rahul Sharma', total: 2499, date: '2023-10-22', status: 'Paid', items: [] },
    { invoiceId: 'INV-2023-003', customerName: 'Tech Solutions Ltd', total: 125000, date: '2023-10-25', status: 'Paid', items: [] },
    { invoiceId: 'INV-2023-004', customerName: 'Priya Singh', total: 8999, date: '2023-10-26', status: 'Paid', items: [] }
  ],
  ims_payments_received: [
    { paymentId: 'PAY-8001', customer: 'Acme Corp', amount: 15450, mode: 'Bank Transfer' },
    { paymentId: 'PAY-8002', customer: 'Rahul Sharma', amount: 2499, mode: 'UPI' },
    { paymentId: 'PAY-8003', customer: 'Tech Solutions Ltd', amount: 50000, mode: 'Cheque' },
    { paymentId: 'PAY-8004', customer: 'Tech Solutions Ltd', amount: 75000, mode: 'Bank Transfer' }
  ],
  ims_returns: [
    { returnId: 'RET-001', customer: 'Rahul Sharma', reason: 'Defective loading port', status: 'Received' },
    { returnId: 'RET-002', customer: 'Acme Corp', reason: 'Wrong Color Shipped', status: 'Pending' }
  ],
  ims_credit_notes: [
    { noteId: 'CN-001', customer: 'Rahul Sharma', amount: 2499 },
    { noteId: 'CN-002', customer: 'Acme Corp', amount: 5000 }
  ],
  ims_challans: [
    { challanId: 'DC-001', customer: 'Acme Corp', date: '2023-10-20', status: 'Delivered' },
    { challanId: 'DC-002', customer: 'Tech Solutions Ltd', date: '2023-10-24', status: 'In Transit' }
  ],
  ims_categories: [
    { name: 'Electronics', description: 'Gadgets and devices' },
    { name: 'Furniture', description: 'Office and home furniture' },
    { name: 'Stationery', description: 'Paper, pens, and office supplies' }
  ],
  ims_suppliers: [
    { name: 'TechDistro India Pvt Ltd', contact: '9876543210', gst: '27AABCT3518Q1ZV', email: 'orders@techdistro.in', address: 'Mumbai, MH' },
    { name: 'Office Essentials Corp', contact: '9988776655', gst: '07AACCO1122F1ZX', email: 'sales@officeessentials.com', address: 'Delhi, DL' },
    { name: 'Global Logistix', contact: '8877665544', gst: '33AABCG9988L1ZA', email: 'support@globallogistix.com', address: 'Chennai, TN' }
  ],
  ims_expenses: [
    { date: '2023-10-01', category: 'Rent', amount: 25000, paidThrough: 'Bank Account' },
    { date: '2023-10-05', category: 'Office Supplies', amount: 1500, paidThrough: 'Petty Cash' },
    { date: '2023-10-15', category: 'Travel', amount: 4500, paidThrough: 'Bank Account' }
  ],
  ims_receives: [
    { receiveId: 'REC-001', date: '2023-09-15', supplier: 'TechDistro India Pvt Ltd', status: 'Received' },
    { receiveId: 'REC-002', date: '2023-10-12', supplier: 'Office Essentials Corp', status: 'Received' }
  ],
  ims_bills: [
    { billId: 'BILL-9988', supplier: 'TechDistro India Pvt Ltd', amount: 45000, dueDate: '2023-11-01', status: 'Open' },
    { billId: 'BILL-4455', supplier: 'Office Essentials Corp', amount: 12500, dueDate: '2023-10-28', status: 'Paid' }
  ],
  ims_vendor_payments: [
    { paymentId: 'VPAY-001', supplier: 'Office Essentials Corp', amount: 5000, mode: 'Bank Transfer' },
    { paymentId: 'VPAY-002', supplier: 'TechDistro India Pvt Ltd', amount: 20000, mode: 'Cheque' }
  ],
  ims_vendor_credits: [
    { creditId: 'VCN-001', supplier: 'TechDistro India Pvt Ltd', amount: 2000 }
  ],
  ims_adjustments: [
    { reference: 'ADJ-001', reason: 'Stock Take Discrepancy', type: 'Quantity', description: 'Found 2 extra mice during audit', status: 'Adjusted' },
    { reference: 'ADJ-002', reason: 'Damaged Goods', type: 'Value', description: 'Water damage on box 4', status: 'Adjusted' },
    { reference: 'ADJ-003', reason: 'Damaged Goods', type: 'Quantity', description: 'Damaged in warehouse handling', status: 'Adjusted' }
  ],
  ims_purchases: [
    {
      supplierName: 'TechDistro India Pvt Ltd',
      items: [{ name: 'Wireless Ergonomic Mouse', quantity: 50, costPrice: 800, gst: 18 }],
      subtotal: 40000,
      tax: 7200,
      total: 47200,
      date: '2023-10-10T00:00:00.000Z'
    },
    {
      supplierName: 'Office Essentials Corp',
      items: [{ name: 'A4 Paper Ream (500 Sheets)', quantity: 200, costPrice: 180, gst: 12 }],
      subtotal: 36000,
      tax: 4320,
      total: 40320,
      date: '2023-10-15T00:00:00.000Z'
    }
  ]
};

export const seedSalesResources = async () => {
  for (const [resourceKey, records] of Object.entries(seedData)) {
    const count = await ResourceEntry.countDocuments({ resourceKey });
    if (count > 0) {
      continue;
    }

    const docs = records.map((entry) => ({ resourceKey, data: entry }));
    await ResourceEntry.insertMany(docs);
  }
};
