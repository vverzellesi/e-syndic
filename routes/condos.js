var express = require('express'),
    router = express.Router(),
    middleware = require('../middleware'),
    Condo = require('../models/condo'),
    User = require('../models/user');

// create view
router.get('/new', function(req, res) {
    res.render('condos/new');
});

// create logic
router.post('/', function(req, res) {
    Condo.create(req.body.condo, function(err, createdCondo) {
        if (err) {
            console.log(err);
        } else {
            // register new user
            var newUser = new User({ username: req.body.username, role: 'admin', condoId: createdCondo._id });
            User.register(newUser, req.body.password, function(err, user) {
                if (err) {
                    req.flash('error', err.message);
                    console.log(err);
                } else {
                    req.login(user, function(err, loggedUser) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.flash('success', 'Condomínio criado com sucesso!');
                            return res.redirect('/condos/' + createdCondo._id);
                        }
                    });
                }
            });

        }
    });
});

// show
router.get('/:id', function(req, res) {
    Condo.findById(req.params.id).populate('towers').exec(function(err, foundCondo) {
        if (err) {
            console.log(err);
        } else {
            res.render('condos/show', { condo: foundCondo });
        }
    });
});

// edit
router.get('/:id/edit', function(req, res) {
    Condo.findById(req.params.id, function(err, foundCondo) {
        if (err) {
            console.log(err);
        } else {
            res.render('condos/edit', { condo: foundCondo });
        }
    });
});

// update
router.put('/:id', function(req, res) {
    Condo.findByIdAndUpdate(req.params.id, req.body.condo, function(err, updatedCondo) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/condos/' + req.params.id);
        }
    });
});

// destroy
router.delete('/:id', function(req, res) {
    Condo.findByIdAndRemove(req.params.id, function(err, condo) {
        console.log(condo);
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos');
        }
    });
});

module.exports = router;