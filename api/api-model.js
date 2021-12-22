const db = require('../data/db-config.js');

module.exports = {
    findAllTransactions,
    findCurrentBalances,
    makeNewTransaction,
    removePoints
};

function findAllTransactions() {
    return db('transaction').orderBy('transaction_id');
};

function findCurrentBalances() {
    // placeholder object
    currentBalances = {};

    return findAllTransactions()
        .then(transactions => {

            // this will map through the current list of transactions
            transactions.map(i => {
                // if the current user is in current balances object it will add the amount of points
                // or we will create a new name value pair
                if(!currentBalances.hasOwnProperty(i.payer)) {
                    currentBalances[`${i.payer}`] = i.points
                }
                else {
                    currentBalances[`${i.payer}`] += i.points
                }
            });

            return currentBalances
        });
};

function getTransactionById(id) {
    
    return db('transaction').where({ transaction_id: id}).first();
}

function makeNewTransaction(transaction) {

    // inserts a new transaction into the database
    return db('transaction').insert(transaction).returning('transaction_id')
        .then(ids => {

            // takes first item in returned array and finds the transaction
            return getTransactionById(ids[0]);
        });
};

async function removePoints(points) {
    let removingTransactions = await findAllTransactions()
        .then(transactions => {
            return createSpendTransactions(points, transactions);
        })
        .catch(error => {
            return error
        });
        
    // tests if the return is a complete object
    if(typeof removingTransactions === 'object') {

        // parsing through the data to send a single insert
        // it will be in array form incase of a bulk amount
        pars = []
        removingTransactions.map(i => {
            let holder = {
                payer: i.payer,
                points: i.points,
                timestamp: new Date()
            };
            pars.push(holder);
        });
        
        return db('transaction').insert(pars)
            .then(res => {
                return(removingTransactions);
            });
    } else {
        return removingTransactions;
    }
};


const createSpendTransactions = (points, sortTheseTransactions) => {
    let sortedTransactions = sortByDate(sortTheseTransactions);
    let transactions = {};
    points *= -1;

    // all off my current points to determine if the amount of points sent in are enough to be spent
    let sortedTransactionsPoints = 0
    sortedTransactions.map(i =>{
        sortedTransactionsPoints += i.points;
    })

    if(sortedTransactionsPoints > points) {
        sortedTransactions.map(i => {
            // checks if there are still points
            if(points > 0) {

                // checks if the amount of points is less than the transaction's point amount
                if(i.points > points) {

                    // remove the subtract amount of points from our transaction's points
                    // add transaction to temp object
                    // set points to zero
                    transactions[i.payer] = ((i.points - (i.points - points)) * -1);
                    points = 0;
                } else{

                    // send amount subtracted to temp object
                    // remove the transaction's points from the amount of points we still have to subtract
                    transactions[i.payer] = (i.points * -1);
                    points -= i.points;
                }
            }
        });
        
        // loops through the transactions and removes any that are zero
        let returnArr = [];
        for(key in transactions) {
            if(transactions[key] != 0) {
                returnArr.push({
                    payer: key,
                    points: transactions[key]
                });
            }
        };
        return returnArr;
    } else {
        return(`cannot spend ${points}, the current amount is ${sortedTransactionsPoints}`);
    }
};

const sortByDate = transactions => {
    // sorts the transcations by date
    let sortedTransactions = transactions.sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
    })
    let removeNegs = {}

    // loops through the arr and takes any transactions that would subtract money
    sortedTransactions.map((i, index) => {
        if(i.points < 0) {
            if(removeNegs.hasOwnProperty(i.payer)) {
                removeNegs[i.payer].push(index);
                removeNegs[i.payer][0] += i.points;
            } else {
                removeNegs[i.payer] = [i.points, index];
            };
        };
    });

    // removes the subtracting transactions
    let arrCount = 0;
    for(key in removeNegs) {
        removeNegs[key].map((arr, index) => {
            if(index > 0) {
                sortedTransactions.splice(arr - arrCount, 1)
                arrCount += 1
            };
        });
    };
    
    // loops through the array once more to add and subtract the amounts from the user's current transactions
    sortedTransactions.map((i, index) => {
        if(removeNegs.hasOwnProperty(i.payer)) {
            
            // asks if the oldest transaction is more than the current amount of points
            // if it is, we'll subtract
            // else we will make the current transaction zero, remove the current transaction from the subtracting transaction and look for the next
            if((removeNegs[i.payer][0] *= -1) < i.points) {
                sortedTransactions[index].points += removeNegs[i.payer][0] * -1;
                removeNegs[i.payer][0] = 0;
            } else {
                removeNegs[i.payer][0] += (i.points *= 1);
                sortedTransactions[index].points = 0;
            };
        };
    });

    return(sortedTransactions)
};