var express = require('express');
var app = express();
var things = require('./things.js');
var middlew = require('./middleware.js');
var form = require('./formdata.js');
var mongotest = require('./mongotest.js');
var cookie = require('./cookies.js');

// app.method(path, handler): get, post, put, delete
// app.get(route, callback)
app.get('/', function(rep, res){
    res.send('Hello world!');
});

// app.post('/', function(req, res){
//     res.send('You just called a post method at / \n');
// })

app.all('/all', function(req, res){
    res.send("HTTP method doesn't have any effect on this route!");
 });

 // Dynamic route
//  app.get('/:id', function(req, res){
//     res.send('The id: ' + req.params.id);
//  });

 // Complex dynamic route
 app.get('/things/:name/:id', function(req, res){
    res.send('id: ' + req.params.id + ', name: ' + req.params.name);
 });

 // Pattern Matched Routes
 app.get('/things/:id([0-9]{5})', function(req, res){
    res.send('id: ' + req.params.id);
 });

 // both index.js and things.js should be in same directory
 app.use('/things', things);


// ----------- Middleware --------------
app.use('/middleware', middlew);

// Form data
app.use('/form', form);

// MongoDB Test
app.use('/mongotest', mongotest);

// Cookies
app.use('/cookies', cookie);

 // Other routes here, show pretty warning
app.get('*', function(req, res){
    res.send('Sorry, this is an invalid URL.');
 });

//app.listen(port, [host], [backlog], [callback]])
app.listen(3000);