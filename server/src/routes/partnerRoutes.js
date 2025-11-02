/**
 * Partner Routes
 */

import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
