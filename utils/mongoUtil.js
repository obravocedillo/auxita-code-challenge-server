const MongoClient = require( 'mongodb' ).MongoClient;

// Initialize mongo, so mongo can be used in different routes file
var _db;
module.exports = {
  connectToServer: function( callback ) {
    MongoClient.connect( process.env.url,{ useUnifiedTopology: true }, function( err, client ) {
      _db = client.db('Auxita');
      return callback( err, client );
    } );
  },
  getDb: function() {
    return _db;
  }
};