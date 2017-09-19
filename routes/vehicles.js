var express = require('express'),
    router = express.Router({ mergeParams: true }),
    middleware = require('../middleware');

router.get('/vehicles', function(req, res) {
    Vehicle.find({}, function(err, allvehicles) {
        if (err) {
            console.log(err);
        } else {
            res.render('vehicles/vehicles', { vehicles: allvehicles });
        }
    });
});

router.get('/vehicles/new', middleware.isLoggedIn, function(req, res) {
    res.render('vehicles/new');
});

router.post('/vehicles', middleware.isLoggedIn, function(req, res) {
    Vehicle.create(req.body.vehicle, function(err, newVehicle) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/vehicles');
        }
    });
});

router.get('/vehicles/:id', function(req, res) {
    Vehicle.findById(req.params.id, function(err, foundVehicle) {
        if (err) {
            console.log(err);
        } else {
            res.render('vehicles/show', { vehicle: foundVehicle });
        }
    });
});

router.get('/vehicles/:id/edit', function(req, res) {
    Vehicle.findById(req.params.id, function(err, foundVehicle) {
        if (err) {
            console.log(err);
        } else {
            res.render('vehicles/edit', { vehicle: foundVehicle });
        }
    });
});

router.put('/vehicles/:id', function(req, res) {
    Vehicle.findByIdAndUpdate(req.params.id, req.body.vehicle, function(err, updatedVehicle) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/vehicles/' + req.params.id);
        }
    });
});

module.exports = router;