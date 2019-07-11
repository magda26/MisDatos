const express = require('express');
const mysql = require('mysql');

const app = express();

function doQuery(query, params) {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'admin',
            database: 'magdam'
        });
        connection.connect();
        connection.query(query, params, function (error, results, fields) {
            if (error) {
                reject(error);
            }
            resolve(results);
        });

        connection.end();
    });
}


app.use(express.json());

/**
 * POST
 * http://localhost:1237/deactivateTransaction 
 * 
 * With body data in Json like: 
 * {
 *  "transaction_id":"{transaction_id}"
 * }
 * 
 */
app.post('/deactivateTransaction', function (req, res) {
    var transaction_id = req.body.id;
    doQuery('UPDATE transaction SET status = \'0\' WHERE transaction_id = ?', [transaction_id]).then(results => {
                    res.status(200).json({transaction_id: req.body.id});
                })
});

app.listen(1237, function () {
    console.log('Listening on port 1237!');
});
