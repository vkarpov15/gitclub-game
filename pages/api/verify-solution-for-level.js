'use strict';

import verifySolutionForLevel from '../../backend/verifySolutionForLevel';

export default async function handler(req, res) {
  try {
    const result = await verifySolutionForLevel(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
};