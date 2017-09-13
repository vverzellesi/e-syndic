var express = require('express'),
    router = express.Router(),
    Condo = require('../models/condo'),
    Apartment = require('../models/apartment'),
    Tower = require('../models/tower');

// index
router.get('/condos/:id/towers/:id/apartments', function(req, res) {
    Condo.findById(req.params.id).populate('apartments').exec(function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/index', { condo: condo });
        }
    });
});

// create view
router.get('/condos/:id/towers/:id/apartments/new', isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/new', { condo: condo });
        }
    });
});

// create logic
router.post('/condos/:id/towers/:id/apartments', isLoggedIn, function(req, res) {
    // Condo.findById(req.params.id, function(err, condo) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    Tower.findById(req.params.id, function(err, tower) {
        if (err) {
            console.log(err);
        } else {
            Apartment.create(req.body.tower, function(err, apartment) {
                if (err) {
                    console.log(err);
                } else {
                    tower.apartment.push(apartment);
                    tower.save();
                    res.redirect('/towers/' + tower._id);
                }
            });
        }
    });
    // }
    // });


    // Tower.findById(req.params.id, function(err, tower) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         Apartment.create(req.body.apartment, function(err, apartment) {
    //             tower.apartments.push(tower);
    //             tower.save();
    //             res.redirect('/towers/' + tower._id);
    //         });
    //     }
    // });
});

router.get('/apartments/:id', function(req, res) {
    Apartment.findById(req.params.id, function(err, foundApartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/show', { apartment: foundApartment });
        }
    });
});

router.get('/apartments/:id/edit', function(req, res) {
    Apartment.findById(req.params.id, function(err, foundApartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/edit', { apartment: foundApartment });
        }
    });
});

router.put('/apartments/:id', function(req, res) {
    Apartment.findByIdAndUpdate(req.params.id, req.body.apartment, function(err, updatedApartment) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/apartments/' + req.params.id);
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;