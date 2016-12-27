var _ = require('underscore'),
FileModel = require('./file.model.js'),
FileListView = require('./files.view.js'),
App = {};
$ = require('jquery');
jQuery = $;
window.jQuery = jQuery;
global.jQuery = jQuery;
var bootstrap = require('bootstrap');


App.bootstrap = bootstrap;
App.init = (function() {
  var path = window.location.pathname || "",
  id, model;
  // replace last trailing /
  path = path.replace(/\/$/, "");
  path = path.split('/');
  id = _.last(path);

  // Always have FileListView as the bottom view in the stack
  var listView = App.listView = new FileListView().render();
  
  if (!path || !id){
    return;
  }

  if (id === 'new'){
    console.log("Navigating to new file");
    // Show create new page
    return listView.listenToOnce(listView.collection, 'sync', function(){
      // Only show create new page once the list collection has loaded - prevent double render
      return listView.showFileView(new FileModel());
    });
  }

  model = new FileModel({ _id : id });
  model.fetch({
    success : function(){
      listView.showFileView(model);
    },
    error : function(){
      listView.notify('failure', 'Failed to load file with id ' + id);
    }
  });
})();

module.exports = App;
