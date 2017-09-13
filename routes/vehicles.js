var express = require('express'),
    router = express.Router();

router.get('/vehicles', function(req, res) {
    Vehicle.find({}, function(err, allvehicles) {
        if (err) {
            console.log(err);
        } else {
            res.render('vehicles/vehicles', { vehicles: allvehicles });
        }
    });
});

router.get('/vehicles/new', isLoggedIn, function(req, res) {
    res.render('vehicles/new');
});

router.post('/vehicles', isLoggedIn, function(req, res) {
    Vehicle.create(req.body.vehicle, function(err, newVehicle) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/vehicles');
        }
    });
});

router.get('/vehicles/:id', function(req, res) {
    Vehicle.findById(req.params.id, function(err, foundVehicle) {
        if (err) {
            console.log(err);
        } else {
            res.render('vehicles/show', { vehicle: foundVehicle });
        }
    });
});

router.get('/vehicles/:id/edit', function(req, res) {
    Vehicle.findById(req.params.id, function(err, foundVehicle) {
        if (err) {
            console.log(err);
        } else {
            res.render('vehicles/edit', { vehicle: foundVehicle });
        }
    });
});

router.put('/vehicles/:id', function(req, res) {
    Vehicle.findByIdAndUpdate(req.params.id, req.body.vehicle, function(err, updatedVehicle) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/vehicles/' + req.params.id);
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;