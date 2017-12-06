var Condo = require('../models/condo'),
    Tower = require('../models/tower'),
    Apartment = require('../models/apartment'),
    Vehicle = require('../models/vehicle'),
    Dweller = require('../models/dweller');

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Por favor, faça seu login!');
    res.redirect('/login');
}

middlewareObj.isAdmin = function(req, res, next) {
    if (req.user.role === 'admin') {
        return next();
    }
    req.flash('error', 'Você não tem autorização para realizar esta ação!');
    res.redirect('back');
}

module.exports = middlewareObj;