var express = require('express'),
    router = express.Router(),
    Condo = require('../models/condo'),
    Tower = require('../models/tower');

router.get('/towers', function(req, res) {
    Tower.find({}, function(err, allTowers) {
        if (err) {
            console.log(err);
        } else {
            res.render('towers/index', { towers: allTowers });
        }
    })
});

router.get('/condos/:id/towers/new', isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('towers/new', { condo: condo });
        }
    });
});

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

router.get('/towers/:id', function(req, res) {
    Tower.findById(req.params.id, function(err, foundTower) {
        if (err) {
            console.log(err);
        } else {
            res.render('towers/show', { tower: foundTower });
        }
    });
});

router.get('/towers/:id/edit', function(req, res) {
    Tower.findById(req.params.id, function(err, foundTower) {
        if (err) {
            console.log(err);
        } else {
            res.render('towers/edit', { tower: foundTower });
        }
    });
});

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