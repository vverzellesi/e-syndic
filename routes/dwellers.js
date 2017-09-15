var express = require('express'),
    router = express.Router(),
    Condo = require('../models/condo'),
    Apartment = require('../models/apartment'),
    Tower = require('../models/tower'),
    Dweller = require('../models/dweller'),
    middleware = require('../middleware');

// index
router.get('/condos/:id/towers/:id/apartments/:id/dwellers', middleware.isLoggedIn, function(req, res) {
    Condo.findById(req.params.id).populate('dwellers').exec(function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/index', { condo: condo });
        }
    });




    // Dweller.find({}, function(err, allDwellers) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.render('dwellers/index', { dwellers: allDwellers });
    //     }
    // });
});

router.post('/dwellers', middleware.isLoggedIn, function(req, res) {
    Dweller.create(req.body.dweller, function(err, newDweller) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/dwellers');
        }
    });
});

router.get('/dwellers/new', function(req, res) {
    res.render('dwellers/new');
});

router.get('/dwellers/:id', function(req, res) {
    Dweller.findById(req.params.id, function(err, foundDweller) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/show', { dweller: foundDweller });
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