var mysql = require('mysql2');
var settings = require('./settings.json');
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createConnection(settings);

        db.connect(function(err){
            if(!err) {
                console.log('SQL Database is connected!');
            } else {
                console.log('Error connecting to SQL database!');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();