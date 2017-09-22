var express = require('express'),
    router = express.Router({ mergeParams: true }),
    middleware = require('../middleware'),
    Condo = require('../models/condo'),
    Apartment = require('../models/apartment'),
    Tower = require('../models/tower'),
    Vehicle = require('../models/vehicle');

// index
router.get('/', middleware.isLoggedIn, function(req, res) {
    Apartment.findById(req.params.apartment_id).populate('vehicles').exec(function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('vehicles/index', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment: apartment });
        }
    });
});

// create view
router.get('/new', function(req, res) {
    Apartment.findById(req.params.apartment_id, function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('vehicles/new', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment: apartment });
        }
    })
});

// create logic
router.post('/', middleware.isLoggedIn, function(req, res) {
    Apartment.findById(req.params.apartment_id, function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            Vehicle.create(req.body.vehicle, function(err, vehicle) {
                if (err) {
                    console.log(err);
                } else {
                    vehicle.save();
                    apartment.vehicles.push(vehicle);
                    apartment.save();
                    res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments/' + req.params.apartment_id + '/vehicles');
                }
            });
        }
    });
});

// show
router.get('/:vehicle_id', function(req, res) {
    Vehicle.findById(req.params.vehicle_id, function(err, vehicle) {
        if (err) {
            console.log(err);
        } else {
            res.render('vehicles/show', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment_id: req.params.apartment_id, vehicle: vehicle });
        }
    });
});

// edit
router.get('/:vehicle_id/edit', function(req, res) {
    Vehicle.findById(req.params.vehicle_id, function(err, vehicle) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render('vehicles/edit', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment_id: req.params.apartment_id, vehicle: vehicle });
        }
    });
});

// update
router.put('/:vehicle_id', function(req, res) {
    Vehicle.findByIdAndUpdate(req.params.vehicle_id, req.body.vehicle, function(err, vehicle) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments/' + req.params.apartment_id + '/vehicles');
        }
    });
});

// destroy
router.delete('/:vehicle_id', function(req, res) {
    Vehicle.findByIdAndRemove(req.params.vehicle_id, function(err, vehicle) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments/' + req.params.apartment_id + '/vehicles')
        }
    });
});

module.exports = router;