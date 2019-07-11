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
 * GET
 * http://localhost:1235/points 
 * 
 */
app.get('/points', function (req, res) {

    doQuery('SELECT  user_id AS user , SUM(points) AS transaction_points FROM transaction WHERE status = 1 GROUP BY user_id  ').then(results => {
        res.json(results);
    });
});

app.listen(1235, function () {
    console.log('Listening on port 1235!');
});
