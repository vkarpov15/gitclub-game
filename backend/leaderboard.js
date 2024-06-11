'use strict';

const Player = require('../db/player');
const connect = require('../db/connect');

module.exports = async function leaderboard() {
  await connect();
  
  const players = await Player
    .find({ levelsCompleted: { $gt: 0 } })
    .select({ email: 0 })
    .sort({
      levelsCompleted: -1,
      par: 1,
      gameplayTimeMS: 1
    });
  

  return { players };
};