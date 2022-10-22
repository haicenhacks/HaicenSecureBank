const app = require('express')();
const { v1: uuid } = require('uuid');

// Constant for simplicity.
// In a real application, this would be a db. Here we use th
const transactions = {};
const users = {
    admin: {
        name: 'admin',
        balance: 1000
    },
    haicen: {
        name: 'haicen',
        balance: 5
    }
}

function getUser(username) {
    return users[username];
}

function sendConfirmationMail(fromUser, transferId) {
    // This function would email the user from which money will get deducted.
    // This confirmation would be inaccessible unless you are the fromUser.
    console.log(`Confirmation mail sent to ${fromUser.name} with id ${transferId}`);
}

function storeTransfer(transferId, fromUser, toUser, amount) {
    transactions[transferId] = {
        fromUser: fromUser,
        toUser: toUser,
        amount: amount
    }
}

function getTransfer(transferId) {
    return transactions[transferId];
}

function executeTransfer(transfer) {
    users[transfer.fromUser.name].balance -= transfer.amount;
    users[transfer.toUser.name].balance += transfer.amount;
    console.log('Completed transfer.');
    console.log(getUser(transfer.fromUser.name));
    console.log(getUser(transfer.toUser.name));
}

app.get('/', (req, res) => {
    res.send('If you\'re seeing this, then the lab was set up successfully.')
});

app.get('/transfer/:from/:to/:amount', (req, res) => {
    const transferId = uuid();
    const fromUser = getUser(req.params.from);
    const toUser = getUser(req.params.to);
    const amount = parseInt(req.params.amount);

    if (amount >= 0 && fromUser.balance >= amount) {
        storeTransfer(transferId, fromUser, toUser, amount);
        sendConfirmationMail(fromUser, transferId);
    }
    res.send('Confirmation mail sent');
});

app.get('/listTransfers', (req, res) => {
    resp = "<h1>Recent transactions</h1><ul>"
    for (const t in transactions) {
        fu = transactions[t].fromUser.name
        tu = transactions[t].toUser.name
        amt = transactions[t].amount
        conf = t
        console.log(fu, tu)
        if (fu != 'admin'){
            resp = resp + `<li>From ${fu} to ${tu} $${amt} (conf: ${conf})</li>`
        }
        else {
            resp = resp + `<li>From ${fu} to ${tu} $${amt} (conf: REDACTED)</li>`
        }
    }
    resp = resp + "</ul>"
    
    res.send(resp) 
});

app.get('/confirmTransfer/:id', (req, res) => {
    const transfer = getTransfer(req.params.id);
    if (transfer) executeTransfer(transfer);
    if (transfer) return res.send('Done!');
    res.send('Invalid transferId');
})

app.listen(3000);