var express = require('express');
var router = express.Router();
var dbConnection = require('../databases/dbConnection');

const isLogin =async function(req,res,next){
    console.log(req.session.passport)
    const isLogin = await req.session.passport;
    if(isLogin){
    next()
    }else{
      res.redirect('/login')
    }
  }

router.get('/',isLogin,function(req,res,next) {
    dbConnection.query("select * from customer",function(err,rowsCust,fields){
        if(err) return res.render('error');
        dbConnection.query("select * from vendor",function(err,rowsVendor,fields){
            if(err) return res.render('error')

            console.log(rowsCust.length);
            console.log(rowsVendor.length)
            res.render('dashboard',{sumCustomer : rowsCust.length,
                                    sumVendor : rowsVendor.length
            });
        })
    }) 
})

module.exports = router;