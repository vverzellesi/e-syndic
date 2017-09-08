var express = require('express'),
    router = express.Router();

router.get('/dwellers', isLoggedIn, function(req, res) {
    Dweller.find({}, function(err, allDwellers) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/index', { dwellers: allDwellers });
        }
    });
});

router.post('/dwellers', isLoggedIn, function(req, res) {
    Dweller.create(req.body.dweller, function(err, newDweller) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/dwellers');
        }
    });
});

router.get('/dwellers/new', function(req, res) {
    res.render('dwellers/new');
});

router.get('/dwellers/:id', function(req, res) {
    Dweller.findById(req.params.id, function(err, foundDweller) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/show', { dweller: foundDweller });
        }
    });
});

router.get('/dwellers/:id/edit', function(req, res) {
    Dweller.findById(req.params.id, function(err, foundDweller) {
        if (err) {
            console.log(err);
        } else {
            res.render('dwellers/edit', { dweller: foundDweller });
        }
    });
});

router.put('/dwellers/:id', function(req, res) {
    Dweller.findByIdAndUpdate(req.params.id, req.body.dweller, function(err, updatedDweller) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/dwellers/' + req.params.id);
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