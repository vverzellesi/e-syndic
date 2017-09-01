var mongoose = require('mongoose');

var Condo = require('./models/condo'),
    Tower = require('./models/tower');

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

                        // adding towers
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
                            }
                        });
                    }
                });
            });
        }
    });
}


module.exports = seedDB;