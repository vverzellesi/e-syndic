var express = require('express'),
    router = express.Router({ mergeParams: true }),
    Condo = require('../models/condo'),
    Apartment = require('../models/apartment'),
    Tower = require('../models/tower'),
    Dweller = require('../models/dweller'),
    middleware = require('../middleware');

// index
router.get('/condos/:id/towers/:tower_id/apartments/:apartment_id/dwellers', middleware.isLoggedIn, function(req, res) {
    Apartment.findById(req.params.apartment_id).populate('dwellers').exec(function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/index', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment: apartment });
        }
    });
});

// create view
router.get('/condos/:id/towers/:tower_id/apartments/:apartment_id/dwellers/new', function(req, res) {
    Apartment.findById(req.params.apartment_id, function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/new', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment: apartment });
        }
    })
});

// create logic
router.post('/condos/:id/towers/:tower_id/apartments/:apartment_id/dwellers', middleware.isLoggedIn, function(req, res) {
    Apartment.findById(req.params.apartment_id, function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            Dweller.create(req.body.dweller, function(err, dweller) {
                if (err) {
                    console.log(err);
                } else {
                    dweller.save();
                    apartment.dwellers.push(dweller);
                    apartment.save();
                    res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments/' + req.params.apartment_id + '/dwellers');
                }
            });
        }
    });
});

// show
router.get('/condos/:id/towers/:tower_id/apartments/:apartment_id/dwellers/:dweller_id', function(req, res) {
    Dweller.findById(req.params.dweller_id, function(err, dweller) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/show', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment_id: req.params.apartment_id, dweller: dweller });
        }
    });
});

router.get('/dwellers/:id/edit', function(req, res) {
    Dweller.findById(req.params.id, function(err, foundDweller) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/edit', { dweller: foundDweller });
        }
    });
});

router.put('/dwellers/:id', function(req, res) {
    Dweller.findByIdAndUpdate(req.params.id, req.body.dweller, function(err, updatedDweller) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/dwellers/' + req.params.id);
        }
    });
});

module.exports = router;