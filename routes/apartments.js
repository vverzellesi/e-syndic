var express = require('express'),
    router = express.Router({ mergeParams: true }),
    Condo = require('../models/condo'),
    Apartment = require('../models/apartment'),
    Tower = require('../models/tower'),
    middleware = require('../middleware');

// index
router.get('/', middleware.isLoggedIn, function(req, res) {
    Tower.findById(req.params.tower_id).populate('apartments').exec(function(err, tower) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/index', { condo_id: req.params.id, tower: tower });
        }
    });
});

// create view
router.get('/new', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Tower.findById(req.params.tower_id, function(err, tower) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/new', { condo_id: req.params.id, tower: tower });
        }
    });
});

// create logic
router.post('/', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
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
router.get('/:apartment_id', middleware.isLoggedIn, function(req, res) {
    Apartment.findById(req.params.apartment_id, function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/show', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment: apartment });
        }
    });
});

// edit
router.get('/:apartment_id/edit', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Apartment.findById(req.params.apartment_id, function(err, apartment) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render('apartments/edit', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment: apartment });
        }
    });
});

// update
router.put('/:apartment_id', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Apartment.findByIdAndUpdate(req.params.apartment_id, req.body.apartment, function(err, updatedApartment) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments');
        }
    });
});

// destroy
router.delete('/:apartment_id', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Apartment.findByIdAndRemove(req.params.apartment_id, function(err, apartment) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments');
        }
    })
});

module.exports = router;