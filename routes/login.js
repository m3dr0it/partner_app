var express = require('express');
var router = express.Router();
const models = require('../models/index');
const passport = require('./passport');

router.get('/',function(req,res,next){
    console.log(req.session.passport)
    const isLogin = req.session.passport;
    if(isLogin){
        res.redirect('/dashboard')
    }else{
        next()
    }
  },function(req,res,next){
    res.render('login')
})

router.post('/',function(req,res,next){
    passport.authenticate('local',function(err,user,info){
        console.log("User : "+user)
        req.login(user,function(err){
            if(err){
                 res.redirect('/login')
            }else{
                return res.redirect('/dashboard')
            }
        })
    })(req,res,next)
});

module.exports = router