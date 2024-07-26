const { Strategy: LocalStrategy } = require('passport-local')
const passportJWT = require('passport-jwt')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const jwtOptions = {
 jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
 secretOrKey: process.env.JWT_SECRET
}



function setPassport({ fastifyPassport, userModel, bcryptjs }) {

  // Local
  fastifyPassport.use(new LocalStrategy({ 
    usernameField: 'email', 
    passwordField: 'password', 
    passReqToCallback: true, 
  }, 
  async (requset, email, password, done) => {
    try { 
      const user = await userModel.findOne({ email }).lean()
      if (!user) return done(null, false, { message: 'user NOT found' })
      const isMatch = await bcryptjs.compare(password, user.password)
      if (!isMatch) return done(null, false, { message: 'email or password incoorect!' })
      return done(null, user)
    } catch (err) {
      return done(err)
    }
    
  }))

  // facebook
  

  // JWT
  fastifyPassport.use(new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await userModel.findById(jwtPayload._id).lean()
      if (user) {
        return done(null, user)
      }
      return done (null, false, { message: 'user not found' }) 
    } catch(err) {
      throw new Error(err)
    }   
  }))

  // Session
  fastifyPassport.registerUserSerializer((user, done) => {
    done(null, user._id);
  });
  fastifyPassport.registerUserDeserializer(async (id, done) => {
    try{
      const user = await userModel.findById(id).lean()
      done(null, user)
    } catch (err) {
      done(err, false)
    }
  })

  console.log('passport configed..')
}

module.exports = setPassport
