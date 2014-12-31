var mongodb = require('mongodb');
var fs = require('graceful-fs');


var maxHeight = 328500;
var minHeight = 327000;
var uri = 'mongodb://localhost:27017/bigchain';
var query = { '$and': [ { 'height': { '$gt': minHeight } }, 
                      { 'height': { '$lt': maxHeight } } ]
            };


mongodb.MongoClient.connect(uri, function(err, db) {
  if (err) throw err;
  fs.writeFile('output.txt', 'txHash,blockHash,prevBlock,mrklRoot,time,bits,nonce,height,numTx,size\n', function(err) { if (err) throw err; });

  var output, id, txes, prev_block, mrkl_root, time, bits, nonce, height, n_tx, size;
  var stream = db.collection('data').find(query).stream();
  stream.on('error', function(err) {
    console.error(err);
  });
  stream.on('data', function(datum) {
    id = datum['_id'];
    txes = datum['txes'];
    prev_block = datum['prev_block'];
    mrkl_root = datum['mrkl_root'];
    time = datum['time'];
    bits = datum['bits'];
    nonce = datum['nonce'];
    height = datum['height'];
    n_tx = datum['n_tx'];
    size = datum['size'];

    for(var i=0; i < txes.length; i++) {
      output = [txes[i], id, prev_block, mrkl_root, time, bits, nonce, height, n_tx, size];
      fs.appendFile('output.txt', output.join(',')+'\n', function(err) { if (err) throw err; });
    }

    console.log('done with block', id, 'for time', time, 'at time', Date.now());
  });
});
