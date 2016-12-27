var log = require('./logger.js');
var Backbone = require('backbone');
var $ = require('jquery');

module.exports = Backbone.Model.extend({
  urlRoot : '/api/files',
  idAttribute : '_id',
});
