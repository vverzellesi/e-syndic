var express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router({ mergeParams: true }),
    middleware = require('../middleware'),
    Condo = require('../models/condo'),
    Space = require('../models/space');

module.exports = router;

// index route
router.get('/', middleware.isLoggedIn, function(req, res) {
    Condo.findById(req.params.id).populate('spaces').exec(function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('spaces/index', { condo: condo });
        }
    });
});

// create view
router.get('/new', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('spaces/new', { condo: condo });
        }
    });
});

// create logic
router.post('/', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            Space.create(req.body.space, function(err, space) {
                if (err) {
                    console.log(err);
                } else {
                    space.condoId = req.params.id;
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
router.get('/:space_id', middleware.isLoggedIn, function(req, res) {
    Space.findById(req.params.space_id, function(err, space) {
        if (err) {
            console.log(err);
        } else {
            res.render('spaces/show', { condo_id: req.params.id, space: space });
        }
    });
});

// edit
router.get('/:space_id/edit', middleware.isLoggedIn, function(req, res) {
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
router.put('/:space_id', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Space.findByIdAndUpdate(req.params.space_id, req.body.space, function(err, updatedSpace) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/spaces/');
        }
    });
});

// schedule space view
router.get('/:space_id/schedule', middleware.isLoggedIn, function(req, res) {
    Space.findById(req.params.space_id, function(err, space) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render('spaces/schedule', { condo_id: req.params.id, space: space });
        }
    });
});

// schedule space logic
router.put('/:space_id/schedule', middleware.isLoggedIn, function(req, res) {
    Space.findOne({
        'condoId': req.params.id,
        'scheduledDates.scheduledDates': req.body.space.scheduledDates
    }, function(err, date) {
        if (err) {
            console.log('MongoDB Error: ' + err);
        } else {
            if (!date) {
                Space.findByIdAndUpdate(req.params.space_id, {
                    '$push': {
                        'scheduledDates': {
                            'scheduledDates': req.body.space.scheduledDates,
                            'author': {
                                _id: req.user._id,
                                username: req.user.username
                            },
                            'guests': {
                                name: req.body.space.name,
                                rg: req.body.space.rg
                            }
                        }
                    }
                }, { "new": true, "upsert": true }, function(err, space) {
                    if (err) {
                        console.log(err);
                    } else {
                        req.flash('success', 'Data reservada com sucesso!');
                        res.redirect('/condos/' + req.params.id + '/spaces/');
                    }
                });
            } else {
                req.flash('error', 'Este dia já foi reservado! Por favor escolha outra data.');
                res.redirect('back');
            }
        }
    })
});

// destroy
router.delete('/:space_id', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Space.findByIdAndRemove(req.params.space_id, function(err, space) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/spaces');
        }
    });
});