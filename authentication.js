var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/my_db', {
    useMongoClient: true,
})
var app = express();

app.set('view engine', 'pug');
app.set('views', './views');
// for parsing application/json
app.use(bodyParser.json());

// Define model User
var userInfo = mongoose.Schema({
    userName: String,
    password: String
});
var UserInfo = mongoose.model("User", userInfo);

// GET
app.get('/', function (req, res) {
    res.render('signup');
});

// POST
app.post('', function (req, res) {
    console.log('signup');
    if (req.body.userName || req.body.password) {
        res.status(400);
        res.send('Model invalid');
    } else {
        UserInfo.find({ userName: req.body.userName }, function (err, respone) {
            if (respone != null) {
                res.render('signup', {
                    message: "User Already Exists! Login or choose another user id"
                });
            }
            var model = new UserInfo({
                userName: req.body.userName,
                password: req.body.password
            });
            model.save(function (err, User) {
                if (!err) {
                    res.redirect('/protected_page');
                }
            });
        })
    }
});

// middleware function
function checkSignIn(req, res) {
    if (req.session.user) {
        next();     //If session exists, proceed to page
    } else {
        var err = new Error("Not logged in!");
        console.log(req.session.user);
        next(err);  //Error, trying to access unauthorized page!
    }
}

app.get('/protected_page', checkSignIn, function (req, res) {
    res.render('protected_page', { id: req.session.user.id })
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', function (req, res) {
    console.log(req);
    if (!req.body.id || !req.body.password) {
        res.render('login', { message: "Please enter both id and password" });
    } else {
        UserInfo.findOne({ userName: req.body.userName, password: req.body.password }, function (err, respone) {
            if (respone != null)
                res.redirect('/protected_page');
            else
                res.render('login', { message: "Invalid credentials!" });
        })
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        console.log("user logged out.")
    });
    res.redirect('/login');
});

app.use('/protected_page', function (err, req, res, next) {
    console.log(err);
    //User should be authenticated! Redirect him to log in.
    res.redirect('/login');
});

module.exports = app;