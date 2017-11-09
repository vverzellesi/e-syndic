var express = require('express'),
    router = express.Router({ mergeParams: true }),
    Condo = require('../models/condo'),
    Feedback = require('../models/feedback'),
    middleware = require('../middleware'),
    ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

// Watson config
var tone_analyzer = new ToneAnalyzerV3({
    username: process.env.TONE_ANALYZER_USER,
    password: process.env.TONE_ANALYZER_PASSWORD,
    version_date: '2017-09-21'
});

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

router.get('/watson', function(req, res) {
    Condo.findById(req.params.id).populate('feedbacks').exec(function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            var tones = [];

            condo.feedbacks.forEach(function(feedback) {
                tones.push(feedback.text);
            });
            // console.log("==== TONES ====");
            // console.log(tones);

            var params = {
                text: tones,
                tones: 'emotion',
                sentences: false
            };

            tone_analyzer.tone(params, function(err, data) {
                if (err)
                    console.log('error:', err);
                else {
                    //var result = JSON.stringify(data, null, 2);
                    console.log('===== DATA ======');
                    console.log(data);
                    res.render('feedbacks/watson', { data: data });
                    // return res.send(data);
                }
            });
        }
    });
})

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