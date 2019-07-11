const express = require('express');
const md5 = require('md5');
const mysql = require('mysql');
const jwt = require('jsonwebtoken')

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
 * http://localhost:1233/login 
 * 
 * With body data in Json like: 
 * {
 *  "email":"{email}",
 *  "password":"{password}",
 * }
 * 
 */
app.post('/login', function (req, res) {

    doQuery('SELECT count(*) as count FROM user WHERE email = ?', [req.body.email]).then(results => {
        if (results[0].count != 0) {
            doQuery('SELECT count(*) as count FROM user WHERE email = ? AND password = ?',
                    [req.body.email,md5(req.body.password)] ).then(results => {
                        if(results[0].count!=0){
                            var tokenData = {
                                username: req.body.email,
                                username: req.body.password
                              }
                              var token = jwt.sign(tokenData, 'Secret Password', {
                                 expiresIn: 60 * 60 * 24 
                              })
                             
                              res.status(200).send({token})
                        }else{
                            res.status(401).json({error:'invalid password'});
                        }
                });
        } else {
            res.status(401).json({ error: 'invalid email' });
        }
    });
});

app.listen(1233, function () {
    console.log('Listening on port 1233!');
});
