'use strict';

const Player = require('../../db/player');
const connect = require('../../db/connect');

module.exports = async function handler(req, res) {
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
}