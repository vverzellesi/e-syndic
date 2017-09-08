var express = require('express'),
    router = express.Router();

router.get('/apartments', function(req, res) {
    Apartment.find({}, function(err, apartments) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/index', { apartments: apartments });
        }
    });
});

router.post('/apartments', isLoggedIn, function(req, res) {
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

router.get('/towers/:id/apartments/new', isLoggedIn, function(req, res) {
    Tower.findById(req.params.id, function(err, tower) {
        if (err) {
            console.log(err);
        } else {
            res.render('apartments/new', { tower: tower });
        }
    });
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