var express = require('express'),
    router = express.Router({ mergeParams: true }),
    middleware = require('../middleware'),
    Condo = require('../models/condo'),
    Space = require('../models/space');

module.exports = router;

// index route
router.get('/condos/:id/spaces/', function(req, res) {
    Condo.findById(req.params.id).populate('spaces').exec(function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('spaces/index', { condo: condo });
        }
    });
});

// create view
router.get('/condos/:id/spaces/new', middleware.isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('spaces/new', { condo: condo });
        }
    });
});

// create logic
router.post('/condos/:id/spaces', middleware.isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            Space.create(req.body.space, function(err, space) {
                if (err) {
                    console.log(err);
                } else {
                    space.save();
                    condo.spaces.push(space);
                    condo.save();
                    res.redirect('/condos/' + condo._id + '/spaces');
                }
            });
        }
    });
});

// show
router.get('/condos/:id/spaces/:space_id', function(req, res) {
    Space.findById(req.params.space_id, function(err, space) {
        if (err) {
            console.log(err);
        } else {
            res.render('spaces/show', { condo_id: req.params.id, space: space });
        }
    });
});

// edit
router.get('/condos/:id/spaces/:space_id/edit', function(req, res) {
    Space.findById(req.params.space_id, function(err, space) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render('spaces/edit', { condo_id: req.params.id, space: space });
        }
    });
});

// update
router.put('/condos/:id/spaces/:space_id', function(req, res) {
    Space.findByIdAndUpdate(req.params.space_id, req.body.space, function(err, updatedSpace) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/spaces/');
        }
    });
});

// destroy
router.delete('/condos/:id/spaces/:space_id', function(req, res) {
    Space.findByIdAndRemove(req.params.space_id, function(err, space) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/spaces');
        }
    });
});