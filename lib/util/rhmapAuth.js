var auth = require('basic-auth');
var rhmapAuth = require('rhmap-auth');

module.exports = function isAuthenticated(req, res, next){
  var user = auth(req) || {name: '', pass: ''};
  rhmapAuth(user.name, user.pass, function(err, isValid){
    if(!err && isValid){
      return next();
    }else{
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="RHMAP"');
      res.end('Access denied');
    }
  });
}

