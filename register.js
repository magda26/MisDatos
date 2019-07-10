const express = require('express');
const md5 = require('md5');
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

app.post('/register', function (req, res) {

    doQuery('SELECT count(*) as count FROM user WHERE email = ?', [req.body.email]).then(results => {
        if (results[0].count == 0) {
            var data = [];
            data.push(md5(req.body.email));
            data.push(new Date());
            data.push(req.body.name);
            data.push(req.body.lastname);
            data.push(req.body.birth_date);
            data.push(req.body.email);
            data.push(md5(req.body.password));
            doQuery('INSERT INTO user (user_id, created_date, name, lastname,birth_date,email,password)' +
                'VALUES (?,?,?,?,?,?,?)', data).then(results => {
                    res.json({user_id: md5(req.body.email)});
                })
        } else {
            res.json({ error: 'email' });
        }
    });
});

app.listen(1232, function () {
    console.log('Listening on port 1232!');
});
