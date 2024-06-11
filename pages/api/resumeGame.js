'use strict';

import Archetype from 'archetype';
import Player from '../../db/player';
import connect from '../../db/connect';

const ResumeGameParams = new Archetype({
  sessionId: {
    $type: 'string',
    $required: true
  }
}).compile('ResumeGameParams');

export default async function handler(req, res) {
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
};