'use strict';

import Archetype from 'archetype';
import assert from 'assert';
import oso from '../../oso';

const TellParams = new Archetype({
  sessionId: {
    $type: 'string',
    $required: true
  },
  factType: {
    $type: 'string',
    $required: true,
    $enum: ['role', 'attribute']
  },
  userId: {
    $type: 'string',
    $validate: (v, type, doc) => assert.ok(v != null || doc.factType !== 'role')
  },
  role: {
    $type: 'string',
    $validate: (v, type, doc) => assert.ok(v != null || doc.factType !== 'role')
  },
  resourceType: {
    $type: 'string',
    $required: (doc) => doc.role !== 'superadmin'
  },
  resourceId: {
    $type: 'string',
    $required: (doc) => doc.role !== 'superadmin'
  },
  attribute: {
    $type: 'string',
    $validate: (v, type, doc) => assert.ok(v != null || doc.factType !== 'attribute')
  },
  attributeValue: {
    $type: 'boolean',
    $validate: (v, type, doc) => assert.ok(v != null || doc.factType !== 'attribute')
  }
}).compile('TellParams');

export default async function handler(req, res) {
  try {
    const params = new TellParams(req.body);
    assert.ok(
      params.attribute == null || ['is_public', 'is_protected'].includes(params.attribute),
      'Invalid attribute'
    );
  
    if (params.factType === 'role') {
      const resourceId = params.resourceType === 'Repository' ? `${params.sessionId}_${params.resourceId}` : params.resourceId;
      
      if (params.role === 'superadmin') {
        await oso.tell(
          'has_role',
          { type: 'User', id: `${params.sessionId}_${params.userId}` },
          params.role
        );
      } else {
        await oso.tell(
          'has_role',
          { type: 'User', id: `${params.sessionId}_${params.userId}` },
          params.role,
          { type: params.resourceType, id: resourceId }
        );
      }
    } else {
      await oso.tell(
        params.attribute,
        { type: 'Repository', id: `${params.sessionId}_${params.resourceId}` },
        { type: 'Boolean', id: !!params.attributeValue + '' }
      );
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
};