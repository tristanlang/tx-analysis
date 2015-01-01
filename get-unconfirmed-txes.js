/*
  Takes an input file as parameter that consists of transactions.
  Prints to stdout a list of unconfirmed transactions.
*/

var mongodb = require('mongodb');
var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader(process.argv[2]);
var uri = 'mongodb://localhost:27017/bigchain';


lr.on('error', function (err) {
  throw err;
});


mongodb.MongoClient.connect(uri, function (err, db) {
  if (err) console.error(err);
  var collection = db.collection('data');

  lr.on('line', function (transaction) {
    if (transaction.length != 0) {
      processLine(transaction, collection);
    }
  });

  // close db 15 mins after the last line of the file is read -> 15 mins long enough to get all txes
  lr.on('exit', function () {
    setTimeout(function () {
      db.close();
    }, 1000 * 15);
  });
});

function processLine(transaction, collection) {
  collection.find({ 'txes': transaction}, { 'height': 1 }, function (err, cursor) {
    cursor.toArray(function (err, results) {
      if (err) throw err;
      if (results.length == 0) console.log(transaction);
    });
  });
}
