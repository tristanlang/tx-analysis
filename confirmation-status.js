/*
  Takes an input:
    1. parameter specificying whether to look for confirmed or unconfirmed txes.
    2. file as parameter that consists of txes.
  Prints to stdout a list of those txes that were previously un/confirmed.
*/

var mongodb = require('mongodb');
var fs = require('fs');


var uri = 'mongodb://localhost:27017/bigchain';
var findType = process.argv[2]; // "confirmed" or "unconfirmed"
var filename = process.argv[3];


fs.readFile(filename, function (err, data) {
  if (err) throw err;

  var txes = data.toString().split('\n');
  mongodb.MongoClient.connect(uri, function (err, db) {
    if (err) console.error(err);
    processTx(0, txes, db, processTx);
  });
});


function processTx (i, txes, db, callback) {
  if (i == txes.length) {
    db.close();
  }
  else {
    var tx = txes[i];
    var collection = db.collection('data');
    collection.find({ 'txes': tx}, { 'height': 1 }, function (err, cursor) {
      cursor.toArray(function (err, results) {
        if (err) throw err;
        if (findType == 'unconfirmed' && results.length == 0 && tx.length != 0) console.log(tx);
        if (findType == 'confirmed' && results.length != 0 && tx.length != 0) console.log(tx);
        
        callback(i+1, txes, db, callback);
      });
    });
  }
}
