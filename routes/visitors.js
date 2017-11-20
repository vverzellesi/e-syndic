var express = require('express'),
    router = express.Router({ mergeParams: true }),
    middleware = require('../middleware'),
    Condo = require('../models/condo'),
    Apartment = require('../models/apartment'),
    Tower = require('../models/tower'),
    Visitor = require('../models/visitor');

// index
router.get('/', middleware.isLoggedIn, function(req, res) {
    Apartment.findById(req.params.apartment_id).populate('visitors').exec(function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('visitors/index', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment: apartment });
        }
    });
});

// create view
router.get('/new', middleware.isLoggedIn, function(req, res) {
    Apartment.findById(req.params.apartment_id, function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('visitors/new', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment: apartment });
        }
    })
});

// create logic
router.post('/', middleware.isLoggedIn, function(req, res) {
    Apartment.findById(req.params.apartment_id, function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            Visitor.create(req.body.visitor, function(err, visitor) {
                if (err) {
                    console.log(err);
                } else {
                    visitor.save();
                    apartment.visitors.push(visitor);
                    apartment.save();
                    res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments/' + req.params.apartment_id + '/visitors');
                }
            });
        }
    });
});

// show
router.get('/:visitor_id', middleware.isLoggedIn, function(req, res) {
    Visitor.findById(req.params.visitor_id, function(err, visitor) {
        if (err) {
            console.log(err);
        } else {
            res.render('visitors/show', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment_id: req.params.apartment_id, visitor: visitor });
        }
    });
});

// edit
router.get('/:visitor_id/edit', middleware.isLoggedIn, function(req, res) {
    Visitor.findById(req.params.visitor_id, function(err, visitor) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render('visitors/edit', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment_id: req.params.apartment_id, visitor: visitor });
        }
    });
});

// update
router.put('/:visitor_id', middleware.isLoggedIn, function(req, res) {
    Visitor.findByIdAndUpdate(req.params.visitor_id, req.body.visitor, function(err, visitor) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments/' + req.params.apartment_id + '/visitors');
        }
    });
});

// destroy
router.delete('/:visitor_id', middleware.isLoggedIn, function(req, res) {
    Visitor.findByIdAndRemove(req.params.visitor_id, function(err, visitor) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments/' + req.params.apartment_id + '/visitors')
        }
    });
});

module.exports = router;