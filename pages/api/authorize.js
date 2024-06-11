'use strict';

import authorize from '../../backend/authorize';

export default async function handler(req, res) {
  try {
    const result = await authorize(req.query);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
};