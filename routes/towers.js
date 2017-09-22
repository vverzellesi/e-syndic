var express = require('express'),
    router = express.Router({ mergeParams: true }),
    Condo = require('../models/condo'),
    Tower = require('../models/tower'),
    middleware = require('../middleware');

// index route
router.get('/', function(req, res) {
    Condo.findById(req.params.id).populate('towers').exec(function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('towers/index', { condo: condo });
        }
    });
});

// create view
router.get('/new', middleware.isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('towers/new', { condo: condo });
        }
    });
});

// create logic
router.post('/', middleware.isLoggedIn, function(req, res) {
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
                    res.redirect('/condos/' + condo._id + '/towers');
                }
            });
        }
    });
});

// show
router.get('/:tower_id', function(req, res) {
    Tower.findById(req.params.tower_id, function(err, tower) {
        if (err) {
            console.log(err);
        } else {
            res.render('towers/show', { condo_id: req.params.id, tower: tower });
        }
    });
});

// edit
router.get('/:tower_id/edit', function(req, res) {
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
router.put('/:tower_id', function(req, res) {
    Tower.findByIdAndUpdate(req.params.tower_id, req.body.tower, function(err, updatedTower) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/towers/');
        }
    });
});

// destroy
router.delete('/:tower_id', function(req, res) {
    Tower.findByIdAndRemove(req.params.tower_id, function(err, tower) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/towers');
        }
    });
});

module.exports = router;