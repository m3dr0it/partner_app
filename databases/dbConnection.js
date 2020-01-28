var express = require('express');
var mysql = require('mysql');
var connectionDb = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'system-p1'
});
connectionDb.connect(function(err){
  if(err){
    console.log("Error  :"+err);
    return;
  }
  console.log("connected to database : "+connectionDb.threadId);
})

module.exports = connectionDb;