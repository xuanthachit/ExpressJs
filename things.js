var express = require('express');
var router = express.Router();

// The '/' route in things.js is actually a subroute of '/things'
router.get('/', function(req, res){
    res.send('GET route on things');
});

router.post('/', function(req, res){
    res.send('POST route on things');
});

module.exports = router;