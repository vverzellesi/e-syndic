var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

// root route
router.get('/', function(req, res) {
    res.render('landing');
});

// register form
router.get('/register', function(req, res) {
    res.render('register');
});

// sign up logic
router.post('/register', function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        } else {
            passport.authenticate('local')(req, res, function() {
                res.redirect('/condos');
            });
        }
    });
});

// show login form
router.get('/login', function(req, res) {
    res.render('login');
});

// login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/condos',
    failureRedirect: '/login'
}), function(req, res) {});

// logout route
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;