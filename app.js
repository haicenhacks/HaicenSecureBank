const app = require('express')();
const { v1: uuid } = require('uuid');

// Constant for simplicity.
// In a real application, this would be a db. Here we use a simple dictionary
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
        amount: amount,
        status: "pending"
    }
}

function getTransfer(transferId) {
    return transactions[transferId];
}


function executeTransfer(transfer) {
    users[transfer.fromUser.name].balance -= transfer.amount;
    users[transfer.toUser.name].balance += transfer.amount;
    transfer.status = "complete";
    console.log('Completed transfer.');
    console.log(getUser(transfer.fromUser.name));
    console.log(getUser(transfer.toUser.name));
}

app.get('/', (req, res) => {
    content = "<h1>Secure Bank</h1><br><h2>User account balances</h2><br><ul>"

    for (const u in users) {
        content += `<li><b>${users[u].name}</b> - Balance: ${users[u].balance}</li>`
    }
    content += `</ul>Make transfers with the API. Ex: GET /transfer/haicen/admin/1 <a href="transfer/haicen/admin/1">Click here to send admin $1</a>`
    if (users['admin'].balance == 0)
    {
        content += "<h1>You have solved the lab</h1>"
    }
    res.send(content) 
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
    res.send('Confirmation mail sent. <a href="/listTransfers">Click Here</a> to view');
});

app.get('/listTransfers', (req, res) => {
    content = "<h1>Secure Bank</h1><br><h2>User account balances</h2><br><ul>"

    for (const u in users) {
        content += `<li><b>${users[u].name}</b> - Balance: ${users[u].balance}</li>`
    }

    content += "</ul><br><h2>Recent transactions</h2><ul>"
    for (const t in transactions) {
        fu = transactions[t].fromUser.name
        tu = transactions[t].toUser.name
        amt = transactions[t].amount
        conf = t
        console.log(transactions[t].status);
        
        if (fu != 'admin'){
            if (transactions[t].status == "pending"){
                content += `<li><i>(pending) From ${fu} to ${tu} $${amt}  <a href="/confirmTransfer/${conf}">Confirm</a></i></li>`
            }
            else {
                content += `<li>From ${fu} to ${tu} ${amt}</li>`
            }
        }
        else {
            if (transactions[t].status == "pending"){
                content += `<li><i>(pending) From ${fu} to ${tu} $${amt} (conf: REDACTED)</i></li>`
            }
            else {
                content += `<li>From ${fu} to ${tu} $${amt} (conf: REDACTED)</li>`
            }
        }
    }
    content += "</ul>"
    
    res.send(content) 
});

app.get('/confirmTransfer/:id', (req, res) => {
    const transfer = getTransfer(req.params.id);
    if (transfer) executeTransfer(transfer);
    if (transfer) return res.send('Done!');
    res.send('Invalid transferId');
})

app.listen(3000);
