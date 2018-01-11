var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/', function(req, res){
    res.cookie('name', 'express').send('cookie set'); //Sets name = express
    // Adding Cookies with Expiration Time
    res.cookie(name, 'expire', {expire: 360000 + Date.now()}); 
    //This cookie also expires after 360000 ms from the time it is set.
    // maxAge: tính thời gian tương đối thay vì tuyệt đối
    res.cookie(name, 'maxAge', {maxAge: 360000});
 });

// Deleting Existing Cookies
app.get('/clear_cookie_foo', function(req, res){
    res.clearCookie('foo');
    res.send('cookie foo cleared');
 });

module.exports = app;