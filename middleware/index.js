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
    res.redirect('/login');
}

module.exports = middlewareObj;