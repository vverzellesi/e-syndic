var express = require('express'),
    router = express.Router({ mergeParams: true }),
    Condo = require('../models/condo'),
    Apartment = require('../models/apartment'),
    Tower = require('../models/tower'),
    middleware = require('../middleware');

// index
router.get('/condos/:id/towers/:tower_id/apartments', function(req, res) {
    Tower.findById(req.params.tower_id).populate('apartments').exec(function(err, tower) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/index', { condo_id: req.params.id, tower: tower });
        }
    })

});

// create view
router.get('/condos/:id/towers/:tower_id/apartments/new', middleware.isLoggedIn, function(req, res) {
    Tower.findById(req.params.tower_id, function(err, tower) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/new', { condo_id: req.params.id, tower: tower });
        }
    });
});

// create logic
router.post('/condos/:id/towers/:tower_id/apartments', middleware.isLoggedIn, function(req, res) {
    Tower.findById(req.params.tower_id, function(err, tower) {
        if (err) {
            console.log(err);
        } else {
            Apartment.create(req.body.apartment, function(err, apartment) {
                if (err) {
                    console.log(err);
                } else {
                    apartment.save();
                    tower.apartments.push(apartment);
                    tower.save();
                    res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments');
                }
            });
        }
    });
});

// show
router.get('/apartments/:id', function(req, res) {
    Apartment.findById(req.params.id, function(err, foundApartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/show', { apartment: foundApartment });
        }
    });
});

// edit
router.get('/apartments/:id/edit', function(req, res) {
    Apartment.findById(req.params.id, function(err, foundApartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/edit', { apartment: foundApartment });
        }
    });
});

// update
router.put('/apartments/:id', function(req, res) {
    Apartment.findByIdAndUpdate(req.params.id, req.body.apartment, function(err, updatedApartment) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/apartments/' + req.params.id);
        }
    });
});

module.exports = router;