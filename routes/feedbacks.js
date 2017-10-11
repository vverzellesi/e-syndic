var express = require('express'),
    router = express.Router({ mergeParams: true }),
    Condo = require('../models/condo'),
    Feedback = require('../models/feedback'),
    middleware = require('../middleware');

// index route
router.get('/', function(req, res) {
    Condo.findById(req.params.id).populate('feedbacks').exec(function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('feedbacks/index', { condo: condo });
        }
    });
});

// create view
router.get('/new', middleware.isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('feedbacks/new', { condo: condo });
        }
    });
});

// create logic
router.post('/', middleware.isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            Feedback.create(req.body.feedback, function(err, feedback) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to feedback
                    feedback.author.id = req.user._id;
                    feedback.author.username = req.user.username;

                    // save feedback
                    feedback.save();
                    condo.feedbacks.push(feedback);
                    condo.save();
                    res.redirect('/condos/' + condo._id + '/feedbacks');
                }
            });
        }
    });
});

// edit
router.get('/:feedback_id/edit', function(req, res) {
    Feedback.findById(req.params.feedback_id, function(err, feedback) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render('feedbacks/edit', { condo_id: req.params.id, feedback: feedback });
        }
    });
});

// update
router.put('/:feedback_id', function(req, res) {
    Feedback.findByIdAndUpdate(req.params.feedback_id, req.body.feedback, function(err, updatedfeedback) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/feedbacks/');
        }
    });
});

// destroy
router.delete('/:feedback_id', function(req, res) {
    Feedback.findByIdAndRemove(req.params.feedback_id, function(err, feedback) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/feedbacks');
        }
    });
});

module.exports = router;