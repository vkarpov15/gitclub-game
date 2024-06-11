'use strict';

const Archetype = require('archetype');
const Player = require('../db/player');
const connect = require('../db/connect');

const ResumeGameParams = new Archetype({
  sessionId: {
    $type: 'string',
    $required: true
  }
}).compile('ResumeGameParams');

module.exports = async function resumeGame(params) {
  const { sessionId } = new ResumeGameParams(params);

  await connect();

  const player = await Player.findOne({
    sessionId
  });

  return { player };
};
