//Lets require/import the HTTP module
let http = require('http');
let StatsD = require('node-statsd');
let MongoClient = require("mongodb").MongoClient;

// Mongo location
const MONGO_HOST = 'mongodb://mongo:27017/local';

// Port we want to listen to
const PORT = 3000;

// Initialise for logging
let StatsDClient = new StatsD({
  host:'graphite'
});

// Connect to the DB first
MongoClient.connect(MONGO_HOST, function(err, db) {
  // Collection
  let postcodeCollection = db.collection('postcodes');

  // Create a server
  let server = http.createServer(handleRequest);

  // Let's start our server
  server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
  });

  // We need a function which handles requests and send response
  function handleRequest(request, response){
    StatsDClient.increment('my_counter');
    let postcode = unescape(request.url.slice(1))
                   .toUpperCase()
                   .replace(" ","");
    postcodeCollection.findOne({pcd:postcode}, {_id:false,lat:true,lon:true}, function(err, result) {
      if (!result) {
	response.end("Not found for "+postcode);
      } else {
	response.end(JSON.stringify(result));
      }
    });
  }
});
