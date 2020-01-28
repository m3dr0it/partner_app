var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var mv = require('mv');

router.get('/',function(req,res,next) {
  res.send('it works')
})

router.get('/download',function(req,res,next) {
  res.send("sukses")
})

router.get('/download/:idCust', function(req,res,next){
  console.log("dodol");
  idCust = req.params.idCust;
  const filepath = "document-customer/"+idCust+"/";
  const filename = "npwp.pdf"
  res.download("document-customer/"+idCust+"/npwp.pdf", "npwp.pdf", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("works");
    }
  })
  // Set disposition and send it.
});
module.exports = router;
