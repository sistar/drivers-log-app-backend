#!/usr/bin/env ts-node
// filepath: /Users/ralf.sigmund/GitHub/drivers-log-app-backend/src/index.ts
// server.ts

import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './webhook';
import rateLimit from 'express-rate-limit';
import { Door }  from "./models/VehicleEvent";
import { Parking } from "./models/VehicleEvent";

const app: express.Express = express();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7', // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  message: 'Too many requests from this IP, please try again later',
  // Add the 'store' option if you need a more robust solution (Redis, etc.)
});

app.use(cors()); // Allow frontend access
app.use(express.json());

// API Endpoint to fetch parking events
app.get('/api/logs', async (req: Request, res: Response) => {
  try {
    const parkingEvents = await Parking.find({ status: "carCapturedTimestamp received" });
    res.json(parkingEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching parking data" });
  }
});

// API Endpoint to fetch door events
app.get('/api/door', async (req: Request, res: Response) => {
  try {
    const doorEvents = await Door.find({ status: "door open state carCapturedTimestamp received" });
    res.json(doorEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching door data" });
  }
});

// Shiftr.io hits this endpoint
app.use('/shiftr-webhook', router);
app.use('/shiftr-webhook', limiter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
