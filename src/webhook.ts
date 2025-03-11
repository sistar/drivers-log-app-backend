import express, { Request, Response, Router } from 'express';
import { apiKeyAuth } from './middleware/apiKeyAuth';
import Location from './models/LocationEvent'; // Assuming you have a Location model defined in models/Location

const router: Router = express.Router();

// Apply API key authentication to this route
router.post('/', apiKeyAuth, async (req: Request, res: Response) => {
  try {
    const shiftrData = req.body;
    console.log('Received data from shiftr.io:', shiftrData);

    // Save the data to MongoDB
    const locationEvent = new Location(shiftrData);
    await locationEvent.save();

    return res.status(200).send('OK');
  } catch (err) {
    console.error('Error processing shiftr.io webhook', err);
    return res.status(500).send('Error');
  }
});

export default router;