var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    dotenv = require('dotenv').config(),
    methodOverride = require('method-override'),
    Condo = require('./models/condo'),
    Tower = require('./models/tower'),
    Apartment = require('./models/apartment'),
    Vehicle = require('./models/vehicle'),
    Dweller = require('./models/dweller'),
    seedDB = require('./seeds');

mongoose.connect(process.env.DB_URL, { useMongoClient: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

seedDB();

app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/condos', function(req, res) {
    Condo.find({}, function(err, allCondos) {
        if (err) {
            console.log(err);
        } else {
            res.render('condos/index', { condos: allCondos });
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
    res.render('condos/new');
});

app.get('/condos/:id', function(req, res) {
    Condo.findById(req.params.id).populate('towers').exec(function(err, foundCondo) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCondo);
            res.render('condos/show', { condo: foundCondo });
        }
    });
});

app.get('/condos/:id/edit', function(req, res) {
    Condo.findById(req.params.id, function(err, foundCondo) {
        if (err) {
            console.log(err);
        } else {
            res.render('condos/edit', { condo: foundCondo });
        }
    });
});

app.put('/condos/:id', function(req, res) {
    Condo.findByIdAndUpdate(req.params.id, req.body.condo, function(err, updatedCondo) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/condos/' + req.params.id);
        }
    });
});

app.get('/towers', function(req, res) {
    Tower.find({}, function(err, allTowers) {
        if (err) {
            console.log(err);
        } else {
            res.render('towers/index', { towers: allTowers });
        }
    })
});

app.get('/towers/new', function(req, res) {
    res.render('towers/new');
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
            res.render('towers/show', { tower: foundTower })
        }
    });
});

app.get('/towers/:id/edit', function(req, res) {
    Tower.findById(req.params.id, function(err, foundTower) {
        if (err) {
            console.log(err);
        } else {
            res.render('towers/edit', { tower: foundTower });
        }
    });
});

app.put('/towers/:id', function(req, res) {
    Tower.findByIdAndUpdate(req.params.id, req.body.tower, function(err, updatedTower) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/towers/' + req.params.id);
        }
    });
});

app.get('/apartments', function(req, res) {

    Apartment.find({}, function(err, apartments) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/index', { apartments: apartments });
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
    res.render('apartments/new');
});

app.get('/apartments/:id', function(req, res) {
    Apartment.findById(req.params.id, function(err, foundApartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/show', { apartment: foundApartment });
        }
    });
});

app.get('/apartments/:id/edit', function(req, res) {
    Apartment.findById(req.params.id, function(err, foundApartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/edit', { apartment: foundApartment });
        }
    });
});

app.put('/apartments/:id', function(req, res) {
    Apartment.findByIdAndUpdate(req.params.id, req.body.apartment, function(err, updatedApartment) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/apartments/' + req.params.id);
        }
    });
});


app.get('/dwellers', function(req, res) {
    Dweller.find({}, function(err, allDwellers) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/index', { dwellers: allDwellers });
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
    res.render('dwellers/new');
});

app.get('/dwellers/:id', function(req, res) {
    Dweller.findById(req.params.id, function(err, foundDweller) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/show', { dweller: foundDweller });
        }
    });
});

app.get('/dwellers/:id/edit', function(req, res) {
    Dweller.findById(req.params.id, function(err, foundDweller) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/edit', { dweller: foundDweller });
        }
    });
});

app.put('/dwellers/:id', function(req, res) {
    Dweller.findByIdAndUpdate(req.params.id, req.body.dweller, function(err, updatedDweller) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/dwellers/' + req.params.id);
        }
    });
});

app.get('/vehicles', function(req, res) {
    Vehicle.find({}, function(err, allvehicles) {
        if (err) {
            console.log(err);
        } else {
            res.render('vehicles/vehicles', { vehicles: allvehicles });
        }
    });
});

app.get('/vehicles/new', function(req, res) {
    res.render('vehicles/new');
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
            res.render('vehicles/show', { vehicle: foundVehicle });
        }
    });
});

app.get('/vehicles/:id/edit', function(req, res) {
    Vehicle.findById(req.params.id, function(err, foundVehicle) {
        if (err) {
            console.log(err);
        } else {
            res.render('vehicles/edit', { vehicle: foundVehicle });
        }
    });
});

app.put('/vehicles/:id', function(req, res) {
    Vehicle.findByIdAndUpdate(req.params.id, req.body.vehicle, function(err, updatedVehicle) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/vehicles/' + req.params.id);
        }
    });
});

app.get('/dashboard', function(req, res) {
    res.render('dashboard');
})

app.get('*', function(req, res) {
    res.send('This page does not exist!');
});

app.listen(process.env.PORT, function() {
    console.log('App is running on port ' + process.env.PORT);
});