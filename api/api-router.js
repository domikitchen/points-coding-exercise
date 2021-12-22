const express = require('express');

const api = require('./api-model.js');

const router = express.Router();

router.get('/', (request, response) => {

    api.findAllTransactions()
        .then(transactions => {
            response.status(200).json(transactions);
        })
        .catch(error => {
            response.status(500).json({ error: 'an unexpected error has occured', error });
        });
});

router.get('/balances', (request, response) => {

    api.findCurrentBalances()
        .then(transactions => {
            response.status(200).json(transactions);
        })
        .catch(error => {
            response.status(500).json({ error: 'an unexpected error has occured', error });
        });
});

router.post('/transaction', validateTransactionInputs, validateTransactionAmount, (request, response) => {
    let transac = request.body;

    // if a timestamp is not provided the local date and time will be assigned
    if(!transac.hasOwnProperty('timestamp')) {
        transac['timestamp'] = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}T${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}Z`
    };

    // takes the call body and sends it to the model
    api.makeNewTransaction(transac)
        .then(transaction => {
            response.status(201).json({ 'created' : transaction });
        })
        .catch(error => {
            response.status(500).json({ error: 'an unexpected error has occured', error });
        });
});

router.post('/spendPoints', validateNegativeNumber, (request, response) => {
    let points = request.body.points;

    api.removePoints(points)
        .then(transactions => {

            // the model will sent back an object if the amount of points is availble to be spend
            if(typeof transactions === 'object') {
                response.status(202).json(transactions);
            } else {
                response.status(400).json({ error: transactions})
            };
        })
        .catch(error => {
            response.status(500).json({ error: error });
        });
});


function validateNegativeNumber(req, res, next) {

    // checks if points is negative and is a number
    if(req.body.points < 0) {
        next();
    }
    else if(typeof req.body.points != 'number') {
        res.status(400).json({ error: 'please send points as a number' });
    } else {
        res.status(400).json({ error: 'please use negative number when taking away points' })
    };
};

async function validateTransactionAmount(req, res, next) {
    let points = req.body.points;
    let payer = req.body.payer;

    // checks if point amount is negative
    if(points < 0) {
        let transactionUser = null;

        // finds all balances
        await api.findCurrentBalances()
            .then(balances => {
                
                // loops through to find a user
                for(key in balances) {
                    if(key === payer) {
                        transactionUser = key;

                        // checks if the current user has enough points
                        if(balances[key] < points * -1) {
                            transactionUser = 400;
                        } else {
                            next();
                        };
                    };
                };
            });

        // if a user is already in the database it moves on
        // you may not take more points from a user than they currently have
        // otherwise you are not allowed to take from a nonexisting user
        if(transactionUser === payer) {
            next();
        }
        else if(transactionUser === 400) {
            res.status(400).json({ error: 'this user does not have enough points to complete this transaction'});
        } else {
            res.status(400).json({ error: 'you cannot take points from a payer that is not in the system' });
        };
    } else {
        next();
    }
};

function validateTransactionInputs(req, res, next) {

    // checks if all inputs are sent in and valid
    if(!req.body.hasOwnProperty('payer') && !req.body.hasOwnProperty('points')) {
        res.status(400).json({ error: 'please enter a payer name and points amount' });
    }
    else if (!req.body.hasOwnProperty('payer')) {
        res.status(400).json({ error: 'please enter a payer name' });
    }
    else if (!req.body.hasOwnProperty('points')) {
        res.status(400).json({ error: 'please enter point amount' });
    }
    else if(typeof req.body.points != 'number') {
        res.status(400).json({ error: 'point must be sent as an integer' });
    }
    else if(typeof req.body.payer != 'string') {
        res.status(400).json({ error: 'payer must be string' });
    } else {
        next();
    };
};

module.exports = router;