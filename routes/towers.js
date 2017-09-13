var express = require('express'),
    router = express.Router(),
    Condo = require('../models/condo'),
    Tower = require('../models/tower');

// index route
router.get('/condos/:id/towers/', function(req, res) {
    Condo.findById(req.params.id).populate('towers').exec(function(err, foundCondo) {
        if (err) {
            console.log(err);
        } else {
            res.render('towers/index', { condo: foundCondo });
        }
    });
});

// create view
router.get('/condos/:id/towers/new', isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('towers/new', { condo: condo });
        }
    });
});

// create logic
router.post('/condos/:id/towers', isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            Tower.create(req.body.tower, function(err, tower) {
                if (err) {
                    console.log(err);
                } else {
                    condo.towers.push(tower);
                    condo.save();
                    res.redirect('/condos/' + condo._id);
                }
            });
        }
    });
});

// show
router.get('/condos/:id/towers/:id', function(req, res) {
    Tower.findById(req.params.id, function(err, tower) {
        if (err) {
            console.log(err);
        } else {
            console.log(tower);
            res.render('towers/show', { tower: tower });
        }
    });
});

// edit
router.get('/towers/:id/edit', function(req, res) {
    Tower.findById(req.params.id, function(err, foundTower) {
        if (err) {
            console.log(err);
        } else {
            res.render('towers/edit', { tower: foundTower });
        }
    });
});

// update
router.put('/towers/:id', function(req, res) {
    Tower.findByIdAndUpdate(req.params.id, req.body.tower, function(err, updatedTower) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/towers/' + req.params.id);
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