const redis = require('redis');
var db;

 function connectDatabase() {
  if (!db) {
    db = redis.createClient({
      legacyMode: true
    });
    db.connect().then(res => {
      console.log('Connected to redis');
    });

    db.on('connect', function() {
      console.log('Connected to redis');
    });
    db.on('error', function() {
      console.log('error connecting to redis');
    })
  }
  return db;
}


module.exports = connectDatabase();