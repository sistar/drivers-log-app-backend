import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// API key authentication middleware
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  const validApiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey !== validApiKey) {
    console.warn('Invalid API key attempt', {
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  
  next();
};