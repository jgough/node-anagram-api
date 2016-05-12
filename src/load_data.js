var unzip = require("unzip2");
var Converter = require("csvtojson").Converter;
var fs = require("fs");
var MongoClient = require("mongodb").MongoClient;
var heapdump = require('heapdump');

var url = 'mongodb://mongo:27017/local';
MongoClient.connect(url, function(err, db) {
  db.createCollection('postcodes', {}, function(err, collection) {
    // Wipe everything first
    collection.removeMany();
    insertDocuments(collection, function() {
      console.log("Adding indexes...");
      collection.createIndex(
	{pcd:1},
	{unique:true, background:true, w:1}, function(err, indexName) {
	  console.log("done.");
	  db.close();
	});
    });
  });
});

var insertDocuments = function(postcodeCollection, callback) {
  // Construct a CSV converter, and don't build the full result
  var csvConverter = new Converter({constructResult:false});
  var csvLineNum = 0;
  var data = [];
    
  csvConverter.on("record_parsed", function (jsonObj) {
    // Buffer the lines and add them to an array, when large flush to mongo
    if (++csvLineNum % 10000 == 0) {
      console.log("Done " + csvLineNum + " lines");
      postcodeCollection.insertMany(data, function(err,result) {
	if (err) {
	  console.log(err);
	}
      });
      data = [];
    }
    
    data.push({
      pcd: jsonObj.pcd.replace(" ",""),
      lat: jsonObj.lat,
      lon: jsonObj.long
    });
  });

  // Flush the buffer at the end of the file
  csvConverter.on("end_parsed", function (jsonObj) {
    console.log("End parsed");
    postcodeCollection.insertMany(data, function(err,result) {
      if (err) {
	console.log(err);
      }

      callback();
    });
  });

  // Read in the zip file and pipe directly to the CSV converter
  fs.createReadStream('/data/downloads/ONSPD_FEB_2016_csv.zip')
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
      var fileName = entry.path;
      var type = entry.type; // 'Directory' or 'File'
      var size = entry.size;
      if (fileName === "Data/ONSPD_FEB_2016_UK.csv") {
	entry.pipe(csvConverter);
      } else {
	entry.autodrain();
      }
    });
}
