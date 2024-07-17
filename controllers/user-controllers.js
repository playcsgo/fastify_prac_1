// controllers/user-controller
class UserController {
  constructor({ userModel }) {
    console.log('[this from constructor]', this)
    this.userModel = userModel
    this.createUser = this.createUser.bind(this)
  }

  async createUser(request, reply) {
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

  //other method
  async bet() {
    
  }
  
}

module.exports = UserController
