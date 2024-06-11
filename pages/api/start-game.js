'use strict';

import startGame from '../../backend/startGame';

export default async function handler(req, res) {
  try {
    const result = await startGame(req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
};