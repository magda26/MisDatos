const express = require('express');
const md5 = require('md5');
const mysql = require('mysql');

const app = express();

function doQuery(query, params) {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'ffxyuna',
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

app.post('/login', function (req, res) {

    doQuery('SELECT count(*) as count FROM user WHERE email = ?', [req.body.email]).then(results => {
        if (results[0].count != 0) {
            doQuery('SELECT count(*) as count FROM user WHERE email = ? AND password = ?', 
                    [req.body.email,md5(req.body.password)] ).then(results => {
                        if(results[0].count!=0){
                            res.json({email:req.body.email});
                        }else{
                            res.json({error:'password'});
                        }
                });
        } else {
            res.json({ error: 'email' });
        }
    });
});

app.listen(1233, function () {
    console.log('Listening on port 1233!');
});
