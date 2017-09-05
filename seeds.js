var mongoose = require('mongoose');

var Condo = require('./models/condo'),
    Tower = require('./models/tower'),
    Apartment = require('./models/apartment');

var data = [{
        name: 'Victor Condo',
        address: 'Av. Paulista, 1000',
    },
    {
        name: 'Chacara Bla',
        address: 'Av. Nove de Julho, 100',
    },
    {
        name: 'Vila Whatever',
        address: 'Rua Qualquer, 5',
    }
];

function seedDB() {
    // remove all condos
    Condo.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('removed condos');

            // add condos
            data.forEach(function(seed) {
                Condo.create(seed, function(err, condo) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('added condo');

                        // remove towers
                        Tower.remove({}, function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('removed towers');

                                // add towers
                                Tower.create({
                                    name: 'A',
                                    floors: 16,
                                    apartmentsPerFloor: 6
                                }, function(err, tower) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        condo.towers.push(tower);
                                        condo.save();
                                        console.log('created new tower');

                                        // remove apartments
                                        Apartment.remove({}, function(err) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                console.log('removed apartments');

                                                // add apartments
                                                Apartment.create({
                                                    number: 22,
                                                    floor: 2,
                                                    dwellers: 'Victor'
                                                }, function(err, apartment) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        tower.apartments.push(apartment);
                                                        tower.save();
                                                        console.log('created new apartment')
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    });
}


module.exports = seedDB;