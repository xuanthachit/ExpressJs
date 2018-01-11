var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/my_db', {
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
// for parsing application/json
app.use(bodyParser.json()); 

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

 // GET: GetAll
 app.get('/person/getall', function(req, res){
    Person.find(function(err, response){
       res.json(response);
    });
 });
 
// GET: /mongotest/person/{name}/{age}
// Model.find(conditions, callback)
app.get('/person/:name/:age', function(req, res, next){
    Person.find({name: req.params.name, age: req.params.age}, 
    function(err, response){
       console.log(response);
    }); 
    next();
});

// GET: /mongotest/person/{nationality} --> only the names of people whose nationality is "params.nationality"
app.get('/person/:nationality', function(req, res, next){
    Person.find({nationality: req.params.nationality}, "name", function(err, response){
        console.log(response);
     });
     next();
})

// Model.findOne(conditions, callback) --> This function always fetches a single

// GET: getbyID
Person.findById("507f1f77bcf86cd799439011", function(err, response){
    console.log(response);
 });

 // PUT:
 // Model.update(condition, updates, callback)
 app.put('/person', function(req, res){
    Person.update({age: req.body.age}, 
        { nationality: req.body.nationality,
        name : req.body.name }, 
        function(err, response){
            if(err) {
                res.json({message: "Error in updating person with id " + req.params.id});
            }else{
                res.json(response);
                console.log(response);
            }
     });
 });

// Model.findOneAndUpdate(condition, updates, callback)
Person.findOneAndUpdate({name: "Ayush"}, {age: 40}, function(err, response) {
    console.log(response);
 });

// Model.findByIdAndUpdate(id, updates, callback)
Person.findByIdAndUpdate("507f1f77bcf86cd799439011", {name: "James"}, 
   function(err, response){
      console.log(response);
});


// DELETE
// Model.remove(condition, [callback])
Person.remove({age:20}); // Remove all people aged 20

// Model.findOneAndRemove(condition, [callback])
Person.findOneAndRemove({name: "Ayush"}); // remove a single

// Model.findByIdAndRemove(id, [callback])
Person.findByIdAndRemove("507f1f77bcf86cd799439011");

app.delete('/person/:id', function(req, res){
    Person.findByIdAndRemove(req.params.id, function(err, response){
       if(err) res.json({message: "Error in deleting record id " + req.params.id});
       else res.json({message: "Person with id " + req.params.id + " removed."});
    });
 });

module.exports = app;
