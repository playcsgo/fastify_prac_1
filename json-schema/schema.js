
const createUserSchema = {
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




module.exports = {
  createUserSchema,
}


/*
schemaName = {
  // Request area layer_1: type, required, properties
  ...
  ...

  // respnse area
  layer_1: 
  response_status_code, 
  additionalProperties: false // 不允許包含未定義的屬性 
  not: {
      required: ['admin']
    }

  layer_2: type: , required, properties, 

}




Request Body:
{
	"name": "user4",
    "email": "user4@gmail.com",
    "password": "test",
    "found": "5000"
}

Response:
200, it should be 
{
    "data": {
        "createdUser": {
            "name": "user4",
            "email": "user4@gmail.com",
            "password": "test",
            "found": 5000,
            "roomNumber": 0,
            "_id": "6699d831bc4345821f58f3c0",
            "friends": [],
            "createdAt": "2024-07-19T03:06:25.701Z",
            "__v": 0
        }
    }
}


*/