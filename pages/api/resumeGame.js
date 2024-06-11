'use strict';

const Archetype = require('archetype');
const Player = require('../../db/player');
const connect = require('../../db/connect');

const ResumeGameParams = new Archetype({
  sessionId: {
    $type: 'string',
    $required: true
  }
}).compile('ResumeGameParams');

module.exports = async function handler(req, res) {
  try {
    const { sessionId } = new ResumeGameParams(req.query);

    await connect();
    
    const player = await Player.findOne({
      sessionId
    });

    return res.status(200).json({ player });
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
}