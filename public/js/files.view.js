var BaseMapperView = require('./base.view.js'),
FilesCollection = require('./files.collection.js'),
FileModel = require('./file.model.js'),
FileView = require('./file.view.js'),
Handlebars = require('./handlebars.js'),
$ =require('jquery');

module.exports = BaseMapperView.extend({
  className: "files",
  el : '.content',
  events : {
    'click .createFile' : 'newFile',
    'click .btn-delete' : 'deleteFile'
  },
  initialize : function(){
    BaseMapperView.prototype.initialize.apply(this, arguments);
    this.collection = new FilesCollection();
    this.collection.fetch();
    this.listenTo(this.collection, 'sync', this.render);
    this.listenTo(this.collection, 'destroy', this.render);
  },
  render : function(){
    if (this.filesView){
      return;
    }
    $('.navbar-utility').hide();
    var tpl = Handlebars.compile($('#tplFilesList').html());
    this.$el.html(tpl({ files : this.collection.toJSON() }));
    return this;
  },
  showSavedFile : function(e){
    var self = this,
    el = $(e.target),
    tagName = e.target.tagName.toLowerCase(),
    id, model;
    if (tagName !== 'tr'){
      if (tagName !== "td" && !el.hasClass('btn-edit')){
        return;
      }
      el = el.parents('tr');  
    }
    
    id = el.data('id');
    model = this.collection.get(id);
    if (!model){
      return this.trigger('notify', 'error', 'Could not find file with id ' + id);
    }
    model.fetch({
      success : function(){
        window.history.pushState(id, "Edit File", "/files/" + id);
        self.showFileView(model);    
      },
      error : function(){
        self.trigger('notify', 'error', 'Could not load file details');
      }
    });
  },
  newFile : function(){
    window.history.pushState("new", "New File", "/files/new");
    this.showFileView(new FileModel());
  },
  showFileView : function(model){
    console.log("test");
    var self = this;
    $('.navbar-utility').show();
    this.fileView = new FileView({
      model : model
    });
    this.listenTo(this.fileView, 'back', function(message){
      self.fileView.remove();
      delete self.fileView;
      self.collection.fetch();
      self.render();
      window.history.pushState('', "Files List", "/");
      if (message){
        //TODO: this should be hooking into an after render event or some such..
        setTimeout(function(){
          self.trigger('notify', 'success', message);  
        }, 100);
      }
    });
    this.$el.html(this.fileView.$el);
    if (model.isNew()){
      this.fileView.render();
    }
  },
  deleteFile: function(e){
    var self = this,
    el = $(e.target).parents('tr'),
    id = el.data('id'), 
    model = this.collection.get(id);
    if (!model){
      return this.trigger('notify', 'error', 'Could not find file with id ' + id);
    }
    return model.destroy({
      success : function(){
        return self.trigger('notify', 'success', 'File deleted');
      },
      error : function(){
        return self.trigger('notify', 'error', 'Could not delete file with id ' + id);
      }
    });
  }
});
