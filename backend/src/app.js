import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import resourceRoutes from './routes/resource.routes.js';
import salesRoutes from './routes/sales.routes.js';
import purchasesRoutes from './routes/purchases.routes.js';
import customerRoutes from './routes/customer.routes.js';
import inventoryAdjustmentsRoutes from './routes/inventory-adjustments.routes.js';
import packagesRoutes from './routes/packages.routes.js';
import shipmentsRoutes from './routes/shipments.routes.js';
import reportsRoutes from './routes/reports.routes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
  })
);
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/inventory-adjustments', inventoryAdjustmentsRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/shipments', shipmentsRoutes);
app.use('/api/reports', reportsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({ success: false, message });
});

export default app;
