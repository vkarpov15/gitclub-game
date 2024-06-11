'use strict';

import deleteFact from '../../backend/deleteFact';

export default async function handler(req, res) {
  try {
    const result = await deleteFact(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({ message: error.message });
  }
};