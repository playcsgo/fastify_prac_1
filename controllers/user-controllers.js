// controllers/user-controller
class UserController {
  constructor({ userModel }) {
    this.userModel = userModel
  }

  async createUser(request, reply) {
    const { name, email, password, found } =  request.body
    const createdUser = await this.userModel.create({
      name,
      email,
      password,
      found: Number(found)
    })

    reply.json({ createdUser })
  }

  //other method
  async bet() {
    
  }
  
}

module.exports = UserController
