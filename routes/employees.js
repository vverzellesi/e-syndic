var express = require('express'),
    router = express.Router({ mergeParams: true }),
    Condo = require('../models/condo'),
    Employee = require('../models/employee'),
    middleware = require('../middleware');

// index route
router.get('/', function(req, res) {
    Condo.findById(req.params.id).populate('employees').exec(function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('employees/index', { condo: condo });
        }
    });
});

// create view
router.get('/new', middleware.isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            res.render('employees/new', { condo: condo });
        }
    });
});

// create logic
router.post('/', middleware.isLoggedIn, function(req, res) {
    Condo.findById(req.params.id, function(err, condo) {
        if (err) {
            console.log(err);
        } else {
            Employee.create(req.body.employee, function(err, employee) {
                if (err) {
                    console.log(err);
                } else {
                    employee.save();
                    condo.employees.push(employee);
                    condo.save();
                    res.redirect('/condos/' + condo._id + '/employees');
                }
            });
        }
    });
});

// show
router.get('/:employee_id', function(req, res) {
    Employee.findById(req.params.employee_id, function(err, employee) {
        if (err) {
            console.log(err);
        } else {
            res.render('employees/show', { condo_id: req.params.id, employee: employee });
        }
    });
});

// edit
router.get('/:employee_id/edit', function(req, res) {
    Employee.findById(req.params.employee_id, function(err, employee) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render('employees/edit', { condo_id: req.params.id, employee: employee });
        }
    });
});

// update
router.put('/:employee_id', function(req, res) {
    Employee.findByIdAndUpdate(req.params.employee_id, req.body.employee, function(err, updatedEmployee) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/employees/');
        }
    });
});

// destroy
router.delete('/:employee_id', function(req, res) {
    Employee.findByIdAndRemove(req.params.employee_id, function(err, employee) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/condos/' + req.params.id + '/employees');
        }
    });
});

module.exports = router;