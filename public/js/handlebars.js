var Handlebars = require('handlebars'),
$ = require('jquery'),
_ = require('underscore');

Handlebars.registerHelper('escapeSingleQuotes', function(data) {
  return data.replace(/'/g, "\\'");
});
Handlebars.registerHelper('escapeDoubleQuotes', function(data) {
  return data.replace(/"/g, '\\"');
});

Handlebars.registerHelper('fa', function(icon){
  return new Handlebars.SafeString('<i class="fa ' + icon + '"></i>');
});

module.exports = Handlebars;