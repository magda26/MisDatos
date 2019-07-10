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

app.get('/history', function (req, res) {

    doQuery('SELECT * FROM transaction ORDER BY created_date DESC ').then(results => {
        res.json(results);
    });
});

app.listen(1234, function () {
    console.log('Listening on port 1234!');
});
