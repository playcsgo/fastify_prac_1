// controllers/user-controller
class UserController {
  constructor({ userModel }) {
    this.userModel = userModel
    this.createUser = this.createUser.bind(this)
  }

  async createUser(request, reply) {
    const { name, email, password, found } =  request.body
    const createdUser = await this.userModel.create({
      name,
      email,
      password,
      found: Number(found)
    })

    return { createdUser }
  }

  //other method
  async getUser(request, reply) {
    const { name, email, password, found } =  request.body
    console.log('[this from createUser]', this)
    const createdUser = await this.userModel.create({
      name,
      email,
      password,
      found: Number(found)
    })

    return { createdUser }
  }

  async bet() {
    
  }
  
}

module.exports = UserController
