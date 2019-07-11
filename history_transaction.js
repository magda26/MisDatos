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
 * http://localhost:1234/history 
 * 
 */
app.get('/history', function (req, res) {

    doQuery('SELECT * FROM transaction ORDER BY created_date DESC ').then(results => {
        res.json(results);
    });
});

/**
 * GET
 * http://localhost:1234/historyByUser/{user_id}
 * 
 * With body data in Json like: 
 * {
 *  "user_id":"{user_id}"
 * }
 * 
 */
app.get('/history/:user_id', function (req, res) {

    doQuery('SELECT * FROM transaction WHERE user_id = ? ORDER BY created_date DESC ',[req.params.user_id]).then(results => {
        res.json(results);
    });
});

app.listen(1234, function () {
    console.log('Listening on port 1234!');
});
