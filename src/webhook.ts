// webhook.ts
import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// POST /shiftr-webhook
router.post('/', async (req: Request, res: Response) => {
  try {
    const shiftrData = req.body;
    console.log('Received data from shiftr.io:', shiftrData);

    // Forward the data to your backend route (which could be in the same app or external)
    const backendUrl = 'https://your-backend.com/drivers-log';

    await axios.post(backendUrl, shiftrData);

    return res.status(200).send('OK');
  } catch (err) {
    console.error('Error processing shiftr.io webhook', err);
    return res.status(500).send('Error');
  }
});

export default router;
