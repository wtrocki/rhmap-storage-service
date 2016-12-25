var express = require('express');
var mbaasApi = require('fh-mbaas-api');
var mbaasExpress = mbaasApi.mbaasExpress();

var app = express();
app.use('/sys', mbaasExpress.sys([]));
app.use('/mbaas', mbaasExpress.mbaas);
app.use(mbaasExpress.fhmiddleware());
app.use('/hello', require('lib/hello.js')());

app.use('/', function(req, res){
  res.end('Your Cloud App is Running');
});

app.use(mbaasExpress.errorHandler());

var server;

exports.before = function(finish){
  console.log('global before');
  if (server) return finish();
  var port = 8052;
  server = app.listen(port, function(){
    console.log("App started at: " + new Date() + " on port: " + port);
    return finish();
  });
};

exports.after = function(finish) {
  console.log('global after');
  mbaasApi.db({
    "act": "close"
  }, function() {
    if (server) {
      server.close(function() {
        return finish();
      });
    } else {
      return finish();
    }
  });
};