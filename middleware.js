var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');


/// --------------- Middleware --------
//Simple request time logger
app.use(function(req, res, next){
    console.log("A new request received at " + Date.now());
    
    //This function call is very important. It tells that more processing is
    //required for the current request and is in the next middleware
    next();
 });

 //Middleware function to log request protocol
app.use('/mid', function(req, res, next){
    console.log("A request for things received at " + Date.now());
    next();
 });
 
 // Route handler that sends the response
 app.get('/mid', function(req, res){
    res.send('Things');
 });

 // Third party middleware
 app.use(cookieParser());

 //First middleware before response is sent
app.use(function(req, res, next){
    console.log("Start");
    next();
 });
 
 //Route handler
 app.get('/', function(req, res, next){
    res.send("Middle");
    next();
 });
 
 app.use('/', function(req, res){
    console.log('End');
 });

module.exports = app;