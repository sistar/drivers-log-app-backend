#!/usr/bin/env ts-node
// filepath: /Users/ralf.sigmund/GitHub/drivers-log-app-backend/src/index.ts
// server.ts


import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

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


/*
_id
67a6300e860b4d10bd8ce4df
latitude
53.554551
status
"carCapturedTimestamp received"
timestamp
2025-02-07T16:08:46.000+00:00
longitude
9.962152
carCapturedTimestamp
2025-02-06T21:01:09.000+00:00
*/
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

/* 
_id
67beede1ce9efc45a762aaba
doorOpenState
"closed"
status
"door open state carCapturedTimestamp received"
timestamp
2025-02-26T10:33:05.000+00:00
carCapturedTimestamp
2025-02-26T09:26:39.000+00:00 
*/
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
