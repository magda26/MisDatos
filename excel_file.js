const express = require('express');
const mysql = require('mysql');
var xl = require('excel4node');
 
const app = express();

app.use(express.json());

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

app.get('/excel', function (req, res) {

    doQuery('SELECT * FROM transaction ').then(results => {
        var wb = new xl.Workbook();
        var ws = wb.addWorksheet('Sheet 1');
        
        var style = wb.createStyle({
            font: {
                color: '#000000',
                size: 12,
                weight: 'normal'
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -',
            });
        var styleBold = wb.createStyle({
            font: {
                color: '#000000',
                size: 14,
                weight: 'bold'
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -',
            });

        ws.cell(1, 1)
          .string("transaction_id")
          .style(styleBold);
        ws.cell(1, 2)
          .string("created_date")
          .style(styleBold);
        ws.cell(1, 3)
          .string("value")
          .style(styleBold);
        ws.cell(1, 4)
          .string("points")
          .style(styleBold);
        ws.cell(1, 5)
          .string("status")
          .style(styleBold);
        ws.cell(1, 6)
          .string("user_id")
          .style(styleBold);

        var row=2;
        results.forEach(element => {            
            ws.cell(row, 1)
            .number(element.transaction_id)
            .style(style);
            ws.cell(row, 2)
            .date(element.created_date)
            .style({numberFormat: 'YYYY-MM-DD HH:MM:SS'});
            ws.cell(row, 3)
            .number(element.value)
            .style(style);
            ws.cell(row, 4)
            .number(element.points)
            .style(style);
            ws.cell(row, 5)
            .string(element.status)
            .style(style);
            ws.cell(row, 6)
            .string(JSON.stringify(element.user_id))
            .style(style);
            row++;
        });
        var fileName = 'Excel.xlsx';
        wb.write(fileName);

        res.sendFile( __dirname + '\\'+fileName, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log('Sent:', fileName)
            }
        })

    });
});

app.listen(1238, function () {
    console.log('Listening on port 1238!');
});
