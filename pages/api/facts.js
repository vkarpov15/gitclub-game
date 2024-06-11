'use strict';

import Archetype from 'archetype';
import oso from '../../oso';

const FactsParams = new Archetype({
  sessionId: {
    $type: 'string',
    $required: true
  },
  userId: {
    $type: ['string'],
    $required: true
  }
}).compile('FactsParams');

export default async function handler(req, res) {
  try {
    const params = new FactsParams(req.body);
    const facts = [];
    for (const userId of params.userId) {
      const factsForUser = await oso.get(
        'has_role',
        { type: 'User', id: `${params.sessionId}_${userId}` },
        null,
        null
      );
      facts.push(...factsForUser);
    }
    for (const repo of ['osohq/sample-apps', 'osohq/nodejs-client', 'osohq/configs']) {
      let factsForRepo = await oso.get(
        'is_protected',
        { type: 'Repository', id: `${params.sessionId}_${repo}` },
        null,
        null
      );
      facts.push(...factsForRepo);
  
      factsForRepo = await oso.get(
        'is_public',
        { type: 'Repository', id: `${params.sessionId}_${repo}` },
        null,
        null
      );
      facts.push(...factsForRepo);
    }
    
    return res.status(200).json({ facts });
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
};