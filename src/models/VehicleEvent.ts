import mongoose, { Schema, Document } from 'mongoose';
import { mongoUri, mongoUrlQueryParams } from '../config/database';
import e from 'express';


interface IParking extends Document {
  latitude: number;
  status: string;
  timestamp: Date;
  longitude: number;
  carCapturedTimestamp: Date;
}

const parkingSchema: Schema = new Schema({
  latitude: { type: Number, required: true },
  status: { type: String, required: true },
  timestamp: { type: Date, required: true },
  longitude: { type: Number, required: true },
  carCapturedTimestamp: { type: Date, required: true },
});

// Define the Door model
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

// Connect to MongoDB Atlas for vehicle events
const vehicleEventsConnection = mongoose.createConnection(`${mongoUri}/weconnect?${mongoUrlQueryParams}`);

const Parking = vehicleEventsConnection.model<IParking>('Parking', parkingSchema, 'vehicle_events');
const Door = vehicleEventsConnection.model<IDoor>('Door', doorSchema, 'vehicle_events');
export { Parking, Door };