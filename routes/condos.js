var express = require('express'),
    router = express.Router(),
    Condo = require('../models/condo'),
    middleware = require('../middleware');

router.get('/condos', function(req, res) {
    Condo.find({}, function(err, allCondos) {
        if (err) {
            console.log(err);
        } else {
            res.render('condos/index', { condos: allCondos });
        }
    })
});

router.post('/condos', middleware.isLoggedIn, function(req, res) {
    Condo.create(req.body.condo, function(err, createdCondo) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/condos');
        }
    });
});

router.get('/condos/new', middleware.isLoggedIn, function(req, res) {
    res.render('condos/new');
});

router.get('/condos/:id', function(req, res) {
    Condo.findById(req.params.id).populate('towers').exec(function(err, foundCondo) {
        if (err) {
            console.log(err);
        } else {
            res.render('condos/show', { condo: foundCondo });
        }
    });
});

router.get('/condos/:id/edit', function(req, res) {
    Condo.findById(req.params.id, function(err, foundCondo) {
        if (err) {
            console.log(err);
        } else {
            res.render('condos/edit', { condo: foundCondo });
        }
    });
});

router.put('/condos/:id', function(req, res) {
    Condo.findByIdAndUpdate(req.params.id, req.body.condo, function(err, updatedCondo) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/condos/' + req.params.id);
        }
    });
});

module.exports = router;