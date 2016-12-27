var log = require('./logger.js'),
BaseMapperView = require('./base.view.js'),
Handlebars = require('./handlebars.js'),
_ = require('underscore'),
$ =require('jquery');

module.exports = BaseMapperView.extend({
  autoRetry : true,
  events : {
  },
  initialize : function(options){
    BaseMapperView.prototype.initialize.apply(this, arguments);
    var html = $('#tplCreateFileView').html();
    console.log(html);
    this.tpl = Handlebars.compile(html);
    this.model = options.model;
    this.listenTo(this.model, 'created', this.onFileUploaded);
  },
  render : function(){
    var model = this.model.toJSON();
    this.$el.html(this.tpl({
      model : model,
      isNew : this.model.isNew(),
      hasBody : typeof model.method !== 'undefined' && model.method !== 'GET',
      methods : this.methods
    }));
    this.trigger('rendered');
  },
  back : function(){
    this.trigger('back');
    return false;
  },
});
