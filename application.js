var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');

var rhmapAuth = require("./lib/util/rhmapAuth");
var configurationMeetRequirements = require("./lib/util/checkRequirements");

var app = express();

// Enable CORS for all requests
app.use(cors());

app.engine('html', require('ejs').renderFile);

// Uncomment to enable platform authentication
// if(!process.env.FH_USE_LOCAL_DB){
//   app.use(rhmapAuth);
// }

app.use('/mbaas', mbaasExpress.mbaas);

// allow serving of static files from the public directory
app.use("static", express.static(__dirname + '/public'));

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

// app.use(function checkRequirements(req, res, next) {
//   if(configurationMeetRequirements()){
//     return next();
//   }
//   return res.render('upgrade.ejs', {});
// });

// if(configurationMeetRequirements()) {
   app.use("/", require("./lib/routes/fileRoute"));
// }

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function() {
  console.log("App started at: " + new Date() + " on port: " + port); 
});
