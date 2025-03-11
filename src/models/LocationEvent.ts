import mongoose, { Schema, Document } from 'mongoose';
import { mongoUri, mongoUrlQueryParams } from '../config/database';

// Connect to MongoDB Atlas for location fixes
const locationFixesConnection = mongoose.createConnection(`${mongoUri}/location_fixes?${mongoUrlQueryParams}`);


interface ILocation extends Document {
  lat: number;
  lon: number;
  alt: number;
  quality: string;
  time: string;
}

const locationSchema: Schema = new Schema({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  alt: { type: Number, required: true },
  quality: { type: String, required: true },
  time: { type: String, required: true },
});


const Location = locationFixesConnection.model<ILocation>('Location', locationSchema, 'vehicle_01');
export default Location;