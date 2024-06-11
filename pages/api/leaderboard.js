'use strict';

import Archetype from 'archetype';
import Player from '../../db/player';
import connect from '../../db/connect';

export default async function handler(req, res) {
  try {
    await connect();
  
    const players = await Player
      .find({ levelsCompleted: { $gt: 0 } })
      .select({ email: 0 })
      .sort({
        levelsCompleted: -1,
        par: 1,
        gameplayTimeMS: 1
      });
    

    return res.status(200).json({ players });
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  } 
};