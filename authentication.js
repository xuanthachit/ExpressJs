var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/my_db', {
    useMongoClient: true,
})
var app = express();

app.set('view engine', 'pug');
app.set('views','./views');
// for parsing application/json
app.use(bodyParser.json()); 

// Define model User
var userInfo = mongoose.Schema({
    userName: String,
    password: String
});
var UserInfo = mongoose.model("User", userInfo);

// GET
app.get('/', function(req, res){
    res.render('signup');
});

// POST
app.post('', function(req, res){
    if(req.body.userName || req.body.password){
        res.status(400);
        res.send('Model invalid');
    }else{
        UserInfo.find({ userName: req.body.userName }, function(err, respone){
            if(respone == null){
                res.render('signup', {
                    message: "User Already Exists! Login or choose another user id"});
            }
            var model = new UserInfo({
                userName: req.body.userName,
                password: req.body.password
            });
            model.save(function(err, User){
                if(!err){
                    res.redirect('/protected_page');
                }
            });
        })
    }
});

module.exports = app;