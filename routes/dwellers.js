var express = require('express'),
    router = express.Router({ mergeParams: true }),
    middleware = require('../middleware'),
    Condo = require('../models/condo'),
    Apartment = require('../models/apartment'),
    Tower = require('../models/tower'),
    Dweller = require('../models/dweller');

// index
router.get('/', middleware.isLoggedIn, function(req, res) {
    Apartment.findById(req.params.apartment_id).populate('dwellers').exec(function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/index', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment: apartment });
        }
    });
});

// create view
router.get('/new', function(req, res) {
    Apartment.findById(req.params.apartment_id, function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/new', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment: apartment });
        }
    })
});

// create logic
router.post('/', middleware.isLoggedIn, function(req, res) {
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
router.get('/:dweller_id', function(req, res) {
    Dweller.findById(req.params.dweller_id, function(err, dweller) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/show', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment_id: req.params.apartment_id, dweller: dweller });
        }
    });
});

// edit
router.get('/:dweller_id/edit', function(req, res) {
    Dweller.findById(req.params.dweller_id, function(err, dweller) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render('dwellers/edit', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment_id: req.params.apartment_id, dweller: dweller });
        }
    });
});

// update
router.put('/:dweller_id', function(req, res) {
    Dweller.findByIdAndUpdate(req.params.dweller_id, req.body.dweller, function(err, dweller) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments/' + req.params.apartment_id + '/dwellers');
        }
    });
});

// destroy
router.delete('/:dweller_id', function(req, res) {
    Dweller.findByIdAndRemove(req.params.dweller_id, function(err, dweller) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments/' + req.params.apartment_id + '/dwellers')
        }
    });
});

module.exports = router;