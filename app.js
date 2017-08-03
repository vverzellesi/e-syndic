var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    dotenv = require('dotenv').config();

mongoose.connect(process.env.DB_URL, { useMongoClient: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

var condoSchema = new mongoose.Schema({
    name: String,
    address: String,
    towers: Number
});

var towerSchema = new mongoose.Schema({
    name: String,
    floors: Number,
    apartmentsPerFloor: Number
});

var Condo = mongoose.model('Condo', condoSchema);
var Tower = mongoose.model('Tower', towerSchema);

app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/condos', function(req, res) {
    Condo.find({}, function(err, allCondos) {
        if (err) {
            console.log(err);
        } else {
            res.render('condos', { condos: allCondos });
        }
    })
});

app.post('/condos', function(req, res) {
    var name = req.body.name;
    var address = req.body.address;
    var towers = req.body.towers;
    var newCondo = {
        name: name,
        address: address,
        towers: towers
    };

    Condo.create(newCondo, function(err, createdCondo) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/condos');
        }
    })
});

app.get('/condos/new', function(req, res) {
    res.render('new-condo');
});

app.get('/condos/:id', function(req, res) {
    Condo.findById(req.params.id, function(err, foundCondo) {
        if (err) {
            console.log(err);
        } else {
            res.render('show-condo', { condo: foundCondo });
        }
    })
});

app.get('/towers', function(req, res) {
    Tower.find({}, function(err, allTowers) {
        if (err) {
            console.log(err);
        } else {
            res.send(allTowers);
        }
    })
});

app.post('/towers', function(req, res) {
    var name = req.params.name;
    var floors = req.params.floors;
    var apartmentsPerFloor = req.params.apartmentsPerFloor;
    var newTower = {
        name: name,
        floors: floors,
        apartmentsPerFloor: apartmentsPerFloor
    };

    Tower.create(newTower, function(err, createdTower) {
        if (err) {
            console.log(err);
        } else {
            res.send(createdTower);
        }
    })
});

app.get('*', function(req, res) {
    res.send('This page does not exist!');
});

app.listen(process.env.PORT, function() {
    console.log('App is running on port ' + process.env.PORT);
});