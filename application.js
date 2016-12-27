var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');
var lessMiddleware = require('less-middleware');

var checkRequirements = require("./lib/util/checkRequirements");
var app = express();

// Enable CORS for all requests
app.use(cors());
app.engine('ejs', require('ejs').__express);

// Uncomment to enable platform authentication
// var rhmapAuth = require("./lib/util/rhmapAuth");
// if(!process.env.FH_USE_LOCAL_DB){
//   app.use(rhmapAuth);
// }

app.use('/mbaas', mbaasExpress.mbaas);
app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));
app.use(mbaasExpress.fhmiddleware());

app.use(function(req, res, next){
  if(checkRequirements()){
    return next();
  }
  return res.render('upgrade.ejs', {});
});

if(checkRequirements()){
  app.use("/api/files", require("./lib/routes/filesApi"));
}

app.get("/*", function(req, res){
  res.render("index.ejs");
});

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function(){
  console.log("App started at: " + new Date() + " on port: " + port);
});
