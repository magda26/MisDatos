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
 * http://localhost:1236/transaction 
 * 
 * With body data in Json like: 
 * {
 *  "value":"{value}",
 *  "points":"{points}",
 *  "user_id":"{user_id}"
 * }
 * 
 */
app.post('/transaction', function (req, res) {
    var data = [];
    data.push(new Date());
    data.push(req.body.value);
    data.push(req.body.points);
    data.push(req.body.user_id);
    data.push('1');
    doQuery('INSERT INTO transaction (created_date, value, points,user_id,status)' +
                'VALUES (?,?,?,?,?)', data).then(results => {
                    res.json({transaction_value: req.body.value});
                })
});

app.listen(1236, function () {
    console.log('Listening on port 1236!');
});
