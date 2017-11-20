var express = require('express'),
    router = express.Router({ mergeParams: true }),
    middleware = require('../middleware'),
    passport = require('passport'),
    Condo = require('../models/condo'),
    Apartment = require('../models/apartment'),
    Tower = require('../models/tower'),
    Dweller = require('../models/dweller'),
    User = require('../models/user');

// twilio credentials
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
// require twilio
var client = require('twilio')(accountSid, authToken);


// index
router.get('/', middleware.isLoggedIn, function(req, res) {
    Apartment.findById(req.params.apartment_id).populate('dwellers').exec(function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/index', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment: apartment });
        }
    });
});

// create view
router.get('/new', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Apartment.findById(req.params.apartment_id, function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/new', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment: apartment });
        }
    })
});

// create logic
router.post('/', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Apartment.findById(req.params.apartment_id, function(err, apartment) {
        if (err) {
            console.log(err);
        } else {
            Dweller.create(req.body.dweller, function(err, dweller) {
                if (err) {
                    console.log(err);
                } else {
                    dweller.save();
                    apartment.dwellers.push(dweller);
                    apartment.save();

                    // register new user
                    var newUser = new User({ username: req.body.dweller.email, role: 'dweller', condoId: req.params.id, dwellerId: dweller._id });
                    User.register(newUser, req.body.password, function(err, user) {
                        if (err) {
                            req.flash('error', err.message);
                            console.log(err);
                        } else {
                            res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments/' + req.params.apartment_id + '/dwellers');
                        }
                    });
                }
            });
        }
    });
});

// show
router.get('/:dweller_id', middleware.isLoggedIn, function(req, res) {
    Dweller.findById(req.params.dweller_id, function(err, dweller) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/show', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment_id: req.params.apartment_id, dweller: dweller });
        }
    });
});

// edit
router.get('/:dweller_id/edit', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Dweller.findById(req.params.dweller_id, function(err, dweller) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render('dwellers/edit', { condo_id: req.params.id, tower_id: req.params.tower_id, apartment_id: req.params.apartment_id, dweller: dweller });
        }
    });
});

// update
router.put('/:dweller_id', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Dweller.findByIdAndUpdate(req.params.dweller_id, req.body.dweller, function(err, dweller) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            User.findOne({ 'dwellerId': dweller._id }, function(err, user) {
                if (err) {
                    console.log(err);
                } else {
                    User.update({ _id: user._id }, {
                        username: req.body.dweller.email
                    }, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments/' + req.params.apartment_id + '/dwellers');
                        }
                    });
                };
            })
        }
    });
});

// destroy
router.delete('/:dweller_id', middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Dweller.findByIdAndRemove(req.params.dweller_id, function(err, dweller) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/condos/' + req.params.id + '/towers/' + req.params.tower_id + '/apartments/' + req.params.apartment_id + '/dwellers')
        }
    });
});

// twilio sms
router.post('/:dweller_id/sms', middleware.isLoggedIn, function(req, res) {
    Dweller.findById(req.params.dweller_id, function(err, dweller) {
        if (err) {
            console.log(err);
        } else {
            var name = dweller.name;
            var phone = dweller.phone;

            client.messages.create({
                to: "+55" + phone,
                from: process.env.TWILIO_FROM_NUMBER,
                body: "Olá, " + name + "! Você possui uma nova encomenda! Por favor, retire-a na administração.",
            }, function(err, message) {
                if (err) {
                    console.log(err);
                }
                req.flash('success', 'Mensagem enviada com sucesso!');
                res.redirect('back');
            });
        }
    });
});

module.exports = router;