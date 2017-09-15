var express = require('express'),
    router = express.Router(),
    Condo = require('../models/condo'),
    Tower = require('../models/tower'),
    middleware = require('../middleware');

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
router.get('/condos/:id/towers/new', middleware.isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('towers/new', { condo: condo });
        }
    });
});

// create logic
router.post('/condos/:id/towers', middleware.isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            Tower.create(req.body.tower, function(err, tower) {
                if (err) {
                    console.log(err);
                } else {
                    tower.save();
                    condo.towers.push(tower);
                    condo.save();
                    res.redirect('/condos/' + condo._id);
                }
            });
        }
    });
});

// show
router.get('/condos/:id/towers/:tower_id', function(req, res) {
    Tower.findById(req.params.tower_id, function(err, tower) {
        if (err) {
            console.log(err);
        } else {
            res.render('towers/show', { tower: tower });
        }
    });
});

// edit
router.get('/condos/:id/towers/:tower_id/edit', function(req, res) {
    Tower.findById(req.params.tower_id, function(err, tower) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render('towers/edit', { condo_id: req.params.id, tower: tower });
        }
    });
});

// update
router.put('/condos/:id/towers/:tower_id', function(req, res) {
    Tower.findByIdAndUpdate(req.params.tower_id, req.body.tower, function(err, updatedTower) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id);
        }
    });
});

// destroy
router.delete('/condos/:id/towers/:tower_id', function(req, res) {
    Tower.findByIdAndRemove(req.params.tower_id, function(err, tower) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id);
        }
    });
})

module.exports = router;