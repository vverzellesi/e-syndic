var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    dotenv = require('dotenv').config(),
    methodOverride = require('method-override'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    Condo = require('./models/condo'),
    Tower = require('./models/tower'),
    Apartment = require('./models/apartment'),
    Vehicle = require('./models/vehicle'),
    Dweller = require('./models/dweller'),
    Space = require('./models/space'),
    Feedback = require('./models/feedback'),
    seedDB = require('./seeds');

// requiring routes
var condoRoutes = require('./routes/condos'),
    apartmentRoutes = require('./routes/apartments'),
    dwellerRoutes = require('./routes/dwellers'),
    towerRoutes = require('./routes/towers'),
    vehicleRoutes = require('./routes/vehicles'),
    spaceRoutes = require('./routes/spaces'),
    feedbackRoutes = require('./routes/feedbacks'),
    indexRoutes = require('./routes/index');


mongoose.connect(process.env.DB_URL, { useMongoClient: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

// PASSPORT CONFIG
app.use(require('express-session')({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use('/condos', condoRoutes);
app.use('/condos/:id/towers', towerRoutes);
app.use('/condos/:id/spaces', spaceRoutes);
app.use('/condos/:id/feedbacks', feedbackRoutes);
app.use('/condos/:id/towers/:tower_id/apartments', apartmentRoutes);
app.use('/condos/:id/towers/:tower_id/apartments/:apartment_id/dwellers', dwellerRoutes);
app.use('/condos/:id/towers/:tower_id/apartments/:apartment_id/vehicles', vehicleRoutes);

app.get('*', function(req, res) {
    res.send('This page does not exist!');
});

app.listen(process.env.PORT, function() {
    console.log('App is running on port ' + process.env.PORT);
});