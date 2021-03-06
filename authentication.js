var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');

mongoose.connect('mongodb://localhost:27017/my_db', {
    useMongoClient: true,
})
var app = express();

app.set('view engine', 'pug');
app.set('views', './views');
// for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: "Your secret key" }));

// Define model User
var userInfo = mongoose.Schema({
    userName: String,
    password: String
});
var UserInfo = mongoose.model("User", userInfo);

// GET
app.get('/signup', function (req, res) {
    res.render('signup');
});

// POST
app.post('/signup', function (req, res) {
    if (!req.body.userName || !req.body.password) {
        res.status(400);
        res.send('Model invalid');
    } else {
        UserInfo.findOne({ userName: req.body.userName }, function (err, response) {
            console.log(response);
            if (response != null) {
                res.render('signup', {
                    message: "User Already Exists! Login or choose another user id"
                });
            }
            else {
                var model = new UserInfo({
                    userName: req.body.userName,
                    password: req.body.password
                });
                model.save(function (err, User) {
                    if (!err) {
                        // Set user information into session
                        req.session.user = User;
                        res.redirect('/authentication/protected_page');
                    }
                });
            }
        })
    }
});

// middleware function
function checkSignIn(req, res, next) {
    if (req.session.user) {
        next();     //If session exists, proceed to page
    } else {
        var err = new Error("Not logged in!");
        console.log(req.session.user);
        next();  //Error, trying to access unauthorized page!
    }
}

app.get('/protected_page', checkSignIn, function (req, res) {
    res.render('protected_page', { userName: req.session.user.userName });
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', function (req, res) {
    if (!req.body.userName || !req.body.password) {
        res.render('login', { message: "Please enter both id and password" });
    } else {
        UserInfo.findOne({ userName: req.body.userName, password: req.body.password }, function (err, response) {
            if (response != null){
                req.session.user = response;
                res.redirect('/authentication/protected_page');
            }
            else
                res.render('login', { message: "Invalid credentials!" });
        })
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        console.log("user logged out.")
    });
    res.redirect('/authentication/login');
});

app.use('/protected_page', function (err, req, res, next) {
    //User should be authenticated! Redirect him to log in.
    res.redirect('/authentication/login');
});

module.exports = app;