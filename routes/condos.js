var express = require('express'),
    router = express.Router(),
    Condo = require('../models/condo'),
    middleware = require('../middleware');

//index
router.get('/', function(req, res) {
    Condo.find({}, function(err, allCondos) {
        if (err) {
            console.log(err);
        } else {
            res.render('condos/index', { condos: allCondos });
        }
    })
});

// create view
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('condos/new');
});

// create logic
router.post('/', middleware.isLoggedIn, function(req, res) {
    Condo.create(req.body.condo, function(err, createdCondo) {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Condomínio criado com sucesso!');
            res.redirect('/condos');
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