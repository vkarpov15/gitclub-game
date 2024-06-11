'use strict';

const Archetype = require('archetype');
const assert = require('assert');
const oso = require('../oso');

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

module.exports = async function handler(params) {
  const validatedParams = new TellParams(params);
  assert.ok(
    validatedParams.attribute == null || ['is_public', 'is_protected'].includes(validatedParams.attribute),
    'Invalid attribute'
  );

  if (validatedParams.factType === 'role') {
    const resourceId = validatedParams.resourceType === 'Repository' ? `${validatedParams.sessionId}_${validatedParams.resourceId}` : validatedParams.resourceId;

    if (validatedParams.role === 'superadmin') {
      await oso.tell(
        'has_role',
        { type: 'User', id: `${validatedParams.sessionId}_${validatedParams.userId}` },
        validatedParams.role
      );
    } else {
      await oso.tell(
        'has_role',
        { type: 'User', id: `${validatedParams.sessionId}_${validatedParams.userId}` },
        validatedParams.role,
        { type: validatedParams.resourceType, id: resourceId }
      );
    }
  } else {
    await oso.tell(
      validatedParams.attribute,
      { type: 'Repository', id: `${validatedParams.sessionId}_${validatedParams.resourceId}` },
      { type: 'Boolean', id: !!validatedParams.attributeValue + '' }
    );
  }
  
  return { ok: true };
};