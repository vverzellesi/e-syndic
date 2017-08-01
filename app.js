var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

var condos = [
    { name: 'Condo Name', towers: 6 },
    { name: 'Vila Bla', towers: 2 }
];

app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/condos', function(req, res) {
    res.render('condos', { condos: condos });
});

app.post('/condos', function(req, res) {
    var name = req.body.name;
    var towers = req.body.towers;
    var newCondo = { name: name, towers: towers };
    condos.push(newCondo);

    res.redirect('/condos');
});

app.get('/condos/new', function(req, res) {
    res.render('new-condo');
});

app.get('*', function(req, res) {
    res.send('This page does not exist!');
});

app.listen(3000, function() {
    console.log('App is running on port 3000!');
});