#!/usr/bin/env ts-node
// filepath: /Users/ralf.sigmund/GitHub/drivers-log-app-backend/src/index.ts
// server.ts


import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './webhook';


const app: express.Express = express();
app.use(cors()); // Allow frontend access
app.use(express.json());

// Ensure that the MONGO_URI is provided
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is not set");
}

// Connect to MongoDB Atlas
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB Connected"))
  .catch((err: Error) => console.error("MongoDB connection error:", err));

interface IParking {
  latitude: number;
  status: string;
  timestamp: Date;
  longitude: number;
  carCapturedTimestamp: Date;
}

const parkingSchema = new mongoose.Schema<IParking>({
  latitude: { type: Number, required: true },
  status: { type: String, required: true },
  timestamp: { type: Date, required: true },
  longitude: { type: Number, required: true },
  carCapturedTimestamp: { type: Date, required: true },
});

// Create the Parking model
const Parking = mongoose.model<IParking>('Parking', parkingSchema, 'vehicle_events');

// API Endpoint to fetch active pricing models
app.get('/api/logs', async (req: Request, res: Response) => {
  try {
    const parkingEvents = await Parking.find({ status: "carCapturedTimestamp received" });
    res.json(parkingEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching parking data" });
  }
});

interface IDoor {
  doorOpenState: string;
  status: string;
  timestamp: Date;
  carCapturedTimestamp: Date;
}

const doorSchema = new mongoose.Schema<IDoor>({
  doorOpenState: { type: String, required: true },
  status: { type: String, required: true },
  timestamp: { type: Date, required: true },
  carCapturedTimestamp: { type: Date, required: true },
});

// Create the Door model
const Door = mongoose.model<IDoor>('Door', doorSchema, 'vehicle_events');

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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
