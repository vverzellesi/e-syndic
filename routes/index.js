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
    if (req.body.syndicCode === process.env.SYNDIC_CODE) {
        newUser.isSyndic = true;
    }
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('register');
        } else {
            passport.authenticate('local')(req, res, function() {
                req.flash('success', 'Seja bem-vindo, ' + user.username);
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
    req.flash('success', 'Até breve!');
    res.redirect('/login');
});

module.exports = router;