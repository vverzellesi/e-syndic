var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    dotenv = require('dotenv').config(),
    methodOverride = require('method-override');

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

var apartmentSchema = new mongoose.Schema({
    number: Number,
    floor: Number,
    dwellers: String
});

var vehicleSchema = new mongoose.Schema({
    brand: String,
    model: String,
    plate: String,
    color: String,
    apartmentOwner: String
});

var dwellerSchema = new mongoose.Schema({
    name: String,
    tower: String,
    apartmentNumber: Number,
    cpf: Number,
    rg: String,
    birthday: String,
    phone: String,
    email: String
});

var Condo = mongoose.model('Condo', condoSchema);
var Tower = mongoose.model('Tower', towerSchema);
var Apartment = mongoose.model('Apartment', apartmentSchema);
var Vehicle = mongoose.model('Vehicle', vehicleSchema);
var Dweller = mongoose.model('Dweller', dwellerSchema);

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
            res.render('towers', { towers: allTowers });
        }
    })
});

app.get('/towers/new', function(req, res) {
    res.render('new-tower');
})

app.post('/towers', function(req, res) {
    var name = req.body.name;
    var floors = req.body.floors;
    var apartmentsPerFloor = req.body.apartmentsPerFloor;
    var newTower = {
        name: name,
        floors: floors,
        apartmentsPerFloor: apartmentsPerFloor
    };

    Tower.create(newTower, function(err, createdTower) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/towers');
        }
    })
});

app.get('/towers/:id', function(req, res) {
    Tower.findById(req.params.id, function(err, foundTower) {
        if (err) {
            console.log(err);
        } else {
            res.render('show-tower', { tower: foundTower })
        }
    });
});

app.get('/apartments', function(req, res) {

    Apartment.find({}, function(err, apartments) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments', { apartments: apartments });
        }
    });
});

app.post('/apartments', function(req, res) {
    var number = req.body.number;
    var floor = req.body.floor;
    var dwellers = req.body.dwellers;
    var newApartment = {
        number: number,
        floor: floor,
        dwellers: dwellers
    };

    Apartment.create(newApartment, function(err, createdApartment) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/apartments');
        }
    })
});

app.get('/apartments/new', function(req, res) {
    res.render('new-apartment');
});

app.get('/apartments/:id', function(req, res) {
    Apartment.findById(req.params.id, function(err, foundApartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('show-apartment', { apartment: foundApartment });
        }
    });
})

app.get('/dwellers', function(req, res) {
    Dweller.find({}, function(err, allDwellers) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers', { dwellers: allDwellers });
        }
    });
});

app.post('/dwellers', function(req, res) {
    Dweller.create(req.body.dweller, function(err, newDweller) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/dwellers');
        }
    });
});

app.get('/dwellers/new', function(req, res) {
    res.render('new-dweller');
});

app.get('/dwellers/:id', function(req, res) {
    Dweller.findById(req.params.id, function(err, foundDweller) {
        if (err) {
            console.log(err);
        } else {
            res.render('show-dweller', { dweller: foundDweller });
        }
    });
});

app.get('/vehicles', function(req, res) {
    Vehicle.find({}, function(err, allvehicles) {
        if (err) {
            console.log(err);
        } else {
            res.render('vehicles', { vehicles: allvehicles });
        }
    });
});

app.get('/vehicles/new', function(req, res) {
    res.render('new-vehicle');
});

app.post('/vehicles', function(req, res) {
    Vehicle.create(req.body.vehicle, function(err, newVehicle) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/vehicles');
        }
    });
});

app.get('/vehicles/:id', function(req, res) {
    Vehicle.findById(req.params.id, function(err, foundVehicle) {
        if (err) {
            console.log(err);
        } else {
            res.render('show-vehicle', { vehicle: foundVehicle });
        }
    });
});

app.get('*', function(req, res) {
    res.send('This page does not exist!');
});

app.listen(process.env.PORT, function() {
    console.log('App is running on port ' + process.env.PORT);
});