'use strict';

import resumeGame from '../../backend/resumeGame';

export default async function handler(req, res) {
  try {
    const result = await resumeGame(req.query);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
};