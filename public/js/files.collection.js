var Backbone = require('backbone'),
FileModel = require('./file.model.js');

module.exports = Backbone.Collection.extend({
  url: '/api/files',
  model : FileModel
});
