const passport = require('passport')
const models = require('../models')
var localStrategy = require('passport-local').Strategy

passport.use('local',new localStrategy({
    usernameField : 'username',
    passwordField : 'password',
    pressReqToCallback : true
},async function(username,password,done){
    console.log("inside passport local strategy")
    try {
        const findAccount = await models.account.findOne({
            where :{
                username : username
            }
        })
        if(findAccount.password == password){
            console.log("password sama mothefucker")
            return done(null,findAccount)
        }else{
            console.log("password salah motherfucker")
            return done(null,false)
        } 
    } catch (error) {
     console.log(error)
     return done(null,error)   
    }
}))

passport.serializeUser(function(req,user,done){
    console.log("inside serialize user")
    console.log(req.body)
    const userToSession = {
        'id' : user.id,
        'roleId' : user.roleId
    }
    done(null,userToSession)
})

passport.deserializeUser( function(req,id,done){
    console.log("inside deserialize user")
    console.log("id : "+id)
    try {
        const findAccount = models.account.findOne({wehere:{
            id : id
        }})
        console.log(findAccount)
        if(findAccount){
            console.log("aman")
            done(null,findAccount)
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = passport;