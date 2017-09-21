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
    seedDB = require('./seeds');

// requiring routes
var condoRoutes = require('./routes/condos'),
    apartmentRoutes = require('./routes/apartments'),
    dwellerRoutes = require('./routes/dwellers'),
    towerRoutes = require('./routes/towers'),
    vehicleRoutes = require('./routes/vehicles'),
    spaceRoutes = require('./routes/spaces'),
    indexRoutes = require('./routes/index');


mongoose.connect(process.env.DB_URL, { useMongoClient: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

//seedDB(); // seed the database

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
app.use(apartmentRoutes);
app.use(condoRoutes);
app.use(dwellerRoutes);
app.use(towerRoutes);
app.use(vehicleRoutes);
app.use(spaceRoutes);

app.get('*', function(req, res) {
    res.send('This page does not exist!');
});

app.listen(process.env.PORT, function() {
    console.log('App is running on port ' + process.env.PORT);
});