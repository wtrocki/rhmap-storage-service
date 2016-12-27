var express = require("express");
var app = express();
var fs = require("fs");

var multer = require("multer");
var upload = multer({dest: "./uploads"});

var mongoose = require("mongoose");
if(process.env.FH_USE_LOCAL_DB){
  console.log("Using local database");
  mongoose.connect("mongodb://localhost/data");
}else if(process.env.FH_MONGODB_CONN_URL){
  console.log("Using migrated database");
  mongoose.connect(process.env.FH_MONGODB_CONN_URL);
}else{
  throw "Cannot connect";
}

var conn = mongoose.connection;

var gfs;

var Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;

conn.once("open", function(){
  gfs = new Grid(conn.db);
  
  app.post("/", upload.single("file"), function(req, res){
    // Create a gridfs-stream into which we pipe multer's temporary file saved in uploads. 
    // After which we delete multer's temp file.
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname
    });
    
    fs.createReadStream("./uploads/" + req.file.filename)
      .on("end", function(){
        fs.unlink("./uploads/" + req.file.filename, function(){
          if(req.body.redirectOnSuccess){
            return res.redirect(req.body.redirectOnSuccess);
          }
          res.json({status: "success"});
        })
      })
      .on("err", function(){
        res.status(400);
        res.json({status: "error when uploading image"});
      }).pipe(writestream);
  });
  
  app.get("/", function(req, res, next){
    // TODO add pagination support
    gfs.files.find({}).skip(0).limit(100).toArray(function(err, files){
      if(err){
        return next(err)
      }
      res.json(files);
    })
  });
  
  // Sends the image we saved by filename.
  app.get("/:filename", function(req, res){
    var readstream = gfs.createReadStream({filename: req.params.filename});
    readstream.on("error", function(){
      res.status(400);
      res.json({status: "IMAGE_NOT_FOUND"});
    });
    readstream.pipe(res);
  });
  
  function checkIfExist(options, callback){
    gfs.exist(options, function(err, found){
      if(err){
        return callback(err, false);
      }
      return callback(null, found);
    });
  }
  
  app['delete']("/:filename", function(req, res){
    checkIfExist({filename: req.params.filename}, function(err, found){
      if(err){
        return res.json({status: "error when deleting file", err: err});
      }
      if(found){
        gfs.remove({filename: req.params.filename}, function(err){
          if(err){
            return res.json({status: "error when deleting file", err: err});
          }
          res.json({status: "success"});
        });
      }else{
        checkIfExist({_id: req.params.filename}, function(err, found){
          if(found){
            gfs.remove({_id: req.params.filename}, function(err){
              if(err){
                return res.json({status: "error when deleting file", err: err});
              }
              res.json({status: "success"});
            });
          }else{
            res.status(400);
            res.json({status: "IMAGE_NOT_FOUND"});
          }
        });
      }
    });
  });
});

app.set("view engine", "ejs");
app.set("views", "./views");

module.exports = app;