var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db', {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  });

app.set('view engine', 'pug');
app.set('views', './views');

// Define model Person
var personSchema = mongoose.Schema({
    name: String,
    age: Number,
    nationality: String
 });
 var Person = mongoose.model("Person", personSchema);

 // GET
 app.get('/person', function(req, res){
    res.render('person');
 });

 //POST
 app.post('/person', function(req, res){
    var model = req.body; // Get the parsed info

    if(!model.name || !model.age || !model.nationality){
        res.render('show_message', {
            message : 'Sorry, you provided wrong info',
            type: 'error'
        })
    }else{
        var newPerson = new Person({
            name : model.name,
            age : model.age,
            nationality : model.nationality
        });

        newPerson.save(function(err, Person){
            if(err){
                res.render('show_message', {
                    message: 'Database error',
                    type: 'error'
                })
            }else{
                res.render('show_message', {
                    message: 'New person added',
                    type: 'success',
                    person: model
                })
            }
        })
    }

 });

module.exports = app;
