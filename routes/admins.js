var express = require('express'),
    router = express.Router({ mergeParams: true }),
    middleware = require('../middleware'),
    Condo = require('../models/condo'),
    Admin = require('../models/admin'),
    User = require('../models/user');

// index route
router.get('/', function(req, res) {
    Condo.findById(req.params.id).populate('admins').exec(function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('admins/index', { condo: condo });
        }
    });
});

// create view
router.get('/new', middleware.isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('admins/new', { condo: condo });
        }
    });
});

// create logic
router.post('/', middleware.isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            Admin.create(req.body.admin, function(err, admin) {
                if (err) {
                    console.log(err);
                } else {
                    admin.save();
                    condo.admins.push(admin);
                    condo.save();

                    // set user role
                    if (req.user.role === 'Corpo Diretivo') {
                        req.user.role = 'admin';
                    } else {
                        req.user.role = 'lobby';
                    }

                    // register new user
                    var newUser = new User({ username: req.body.username, role: req.user.role, condoId: req.params.id });
                    User.register(newUser, req.body.password, function(err, user) {
                        if (err) {
                            req.flash('error', err.message);
                            console.log(err);
                        } else {
                            res.redirect('/condos/' + condo._id + '/admins');
                        }
                    });

                }
            });
        }
    });
});

// show
router.get('/:admin_id', function(req, res) {
    Admin.findById(req.params.admin_id, function(err, admin) {
        if (err) {
            console.log(err);
        } else {
            res.render('admins/show', { condo_id: req.params.id, admin: admin });
        }
    });
});

// update
router.put('/:admin_id', function(req, res) {
    Admin.findByIdAndUpdate(req.params.admin_id, req.body.admin, function(err, updatedAdmin) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/admins/');
        }
    });
});

// destroy
router.delete('/:admin_id', function(req, res) {
    Admin.findByIdAndRemove(req.params.admin_id, function(err, admin) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/admins');
        }
    });
});

module.exports = router;