/*
  Takes an input file as parameter that consists of transactions.
  Prints to stdout a list of unconfirmed transactions.
*/

var mongodb = require('mongodb');
var readline = require('readline');
var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader(process.argv[2]);
var uri = 'mongodb://localhost:27017/bigchain';


lr.on('error', function (err) {
  throw err;
});


mongodb.MongoClient.connect(uri, function (err, db) {
  if (err) console.error(err);

  lr.on('line', function (line) {
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
    });
  });
}
