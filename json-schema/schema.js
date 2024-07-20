
const postUsers = {
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string', /* add other limitation following */ },
      email: { type: 'string' },
      password: { type: 'string' },
      found: { type: 'integer' }
    },
    // additionalProperties: false // limitation attributes in body
  },
  response: {
    '2xx': {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        found: { type: 'integer' },
        roomNumber: { type: 'integer' },
        _id: { type: 'string' },
        friends: {
          type: 'array',
          items: { type: 'string' }
        },
        createdAt: { type: 'string' },
        __v: { type: 'integer' },
      },
      // required: ['test block on controllers and works'],
    }
  }
}

const post_betonetofour = {
  body: {

  }
}


module.exports = {
  postUsers,
  post_betonetofour
}
