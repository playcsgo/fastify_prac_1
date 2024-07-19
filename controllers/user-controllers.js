// controllers/user-controller with 6 RabbitMQ patterns
class UserController {
  constructor({ userModel, rabbitMQ }) {
    this.userModel = userModel
    this.rabbitMQ = rabbitMQ
    this.createUser = this.createUser.bind(this)
    this.getUser = this.getUser.bind(this)
    this.betOnetoFour = this.betOnetoFour.bind(this)
    this.addOrRemoveFriend = this.addOrRemoveFriend.bind(this)
  }
  // 1. Simple Queue - NOT high concurrent requests
  async createUser(request, reply) {
    const { name, email, password, found } =  request.body
    const result = await this.userModel.create({
      name,
      email,
      password,
      found: Number(found)
    })
    const createdUser = result.toObject() // for mongoDB object
    delete createdUser.password
    reply.send(createdUser) 
  }

  async addOrRemoveFriend(request, reply) {
    try {
      const { id } =  request.body
      const friendId = request.params.friendId
      const user = await this.userModel.findById(id)
      if (!user) throw new Error('[user not Found]')
      const friendadded = user.friends.some(user => {
        return user._id.toString() === friendId
      })
      if (friendadded) {
        user.friends = user.friends.filter(f => f._id.toString() !== friendId)
      } else {
        user.friends.push(friendId)
      }
      const updatedUser = await user.save()

      return { updatedUser }
    } catch (err) {
      reply.send(err)
    }
  }



  // 2. Work Queues - high concurrent requests
  // async betOnetoFour(request, reply) {
  //   const { betAmount, betNumber, id } = request.body
  //   const lottery = Number(Math.floor(Math.random() * 4) + 1)
  //   const user = await this.userModel.findById(id)
  //   if (Number(betNumber) === lottery) {
  //     user.found += betAmount * 3.8
  //   } else {
  //     user.found -= betAmount
  //   }
  //   const updatedUser = await user.save()
  //   return updatedUser
  // }
  // -----------------------------
  async betOnetoFour(request, reply) {
    const { betAmount, betNumber, id } = request.body
    const msg = JSON.stringify({ betAmount, betNumber, id })
    
    await this.rabbitMQ.sendToMQ('bet_que', msg)
    return reply.send({ message: 'received betOnetoFour' })
  }


  // 3. Publish/Subscribe - login notice to friend or join room notice

  // 4. Routing - message to a specific user
  // 像之前做的 升級裝備跟充值的那個用法. 

  // 5. Topics - messqage to the same room

  // 6. Request/reply pattern - check bet, check found, refound
  async getUser(request, reply) {
    try {
      const user = await this.userModel.findById(request.params.id).lean()
      return { user }
    } catch (err) {
      throw new Error(err)
    }
  }

  


}

module.exports = UserController
