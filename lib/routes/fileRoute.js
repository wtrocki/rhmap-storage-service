var express = require("express");
var app = express();
var fs = require("fs");

var multer = require("multer");
var upload = multer({dest: "./uploads"});

var mongoose = require("mongoose");
if (!process.env.FH_USE_LOCAL_DB) {
    console.log("Using local database");
    mongoose.connect("mongodb://localhost/images");
} else if (process.env.FH_MONGODB_CONN_URL) {
    console.log("Using migrated database");
    mongoose.connect(process.env.FH_MONGODB_CONN_URL);
} else {
    throw "Cannot connect";
}

var conn = mongoose.connection;

var gfs;

var Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;

conn.once("open", function(){
  gfs = Grid(conn.db);
  app.get("/", function(req,res){
    //renders a multipart/form-data form
    res.render("home");
  });
  
  //second parameter is multer middleware.
  app.post("/", upload.single("file"), function(req, res, next){
    //create a gridfs-stream into which we pipe multer's temporary file saved in uploads. After which we delete multer's temp file.
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname
    });
  
    // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
    fs.createReadStream("./uploads/" + req.file.filename)
      .on("end", function(){fs.unlink("./uploads/"+ req.file.filename, function(err){res.send("success")})})
        .on("err", function(){res.send("Error uploading image")})
          .pipe(writestream);
  });

  app.get("/list", function (req, res, next) {
    gfs.files.find({}).skip(1).limit(100).toArray(function (err, files) {
      if (err) { return next(err) }
      res.json(files);
    })
  });

  // sends the image we saved by filename.
  app.get("/:filename", function(req, res){
      var readstream = gfs.createReadStream({filename: req.params.filename});
      readstream.on("error", function(err){
        res.send("No image found with that title");
      });
      readstream.pipe(res);
  });

  //delete the image
  app.get("/delete/:filename", function(req, res){
    gfs.exist({filename: req.params.filename}, function(err, found){
      if(err) return res.send("Error occured");
      if(found){
        gfs.remove({filename: req.params.filename}, function(err){
          if(err) return res.send("Error occured");
          res.send("Image deleted!");
        });
      } else{
        res.send("No image found with that title");
      }
    });
  });
});

app.set("view engine", "ejs");
app.set("views", "./views");

module.exports = app;