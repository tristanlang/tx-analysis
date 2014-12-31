/*
  From stdin, takes an input file that consists of transactions.
  Prints to stdout a list of unconfirmed transactions.
*/

var mongodb = require('mongodb');
var readline = require('readline');


var uri = 'mongodb://localhost:27017/bigchain';
var query;
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});


rl.on('line', function (line) {
  mongodb.MongoClient.connect(uri, function (err, db) {
    if (err) console.error(err);
    if (line.length != 0) {
      processLine(line, db);
    }
  });
});


function processLine(transaction, db) {
  var collection = db.collection('data');
  collection.find({ 'txes': transaction}, { 'height': 1 }, function (err, cursor) {
    cursor.toArray(function (err, results) {
      if (err) throw err;
      if (results.length == 0) console.log(transaction);
      db.close();
    });
  });
}
