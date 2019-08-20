var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var Schema = mongoose.Schema;

var app = express();

//var imgPath = './pics/pic1.jpg';

mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});

var schema = new Schema({
    name: String,
    img: { data: Buffer, contentType: String }
});

var A = mongoose.model('A', schema);

mongoose.connection.on('open', function () {
  console.error('mongo is open');

    /* var a = new A;
    a.name = "froge";
    a.img.data = fs.readFileSync(imgPath);
    a.img.contentType = 'image/png';
    A.findOne({name: a.name}, function (err, doc) {
        if (doc == null) {
            console.error('new, saved img to mongo');
            a.save(function (err, a) {
                if (err) throw err;
            });
        }
        else{ 
            console.log("repeat, not saving");
            return;
        }
    }); */

      app.listen(3000)
      app.use(bodyParser.raw( { type: "*/*", limit: '18mb' }));
      app.get('/$', function (req, res, next) {
        res.sendFile("index.html", {root: __dirname });
      });

      app.get('/i/:imgname', function (req, res, next) {
        A.findOne({name: req.params.imgname}, function (err, doc) {
            if (doc == null) {
                console.log("name not found in db");
                return;
            }
            else {
                console.log("file found in db");
                res.contentType(doc.img.contentType);
                res.send(doc.img.data);
            }
        });
      });

      app.post("/upload.php", function (req, res) {
        var newImg = new A;
        var newBuffer = new Buffer(req.body);
        if(newBuffer.indexOf("JFIF") > -1){
            newBuffer = newBuffer.slice(newBuffer.indexOf("JFIF") - 6, newBuffer.lastIndexOf("Web") - 6);
        }
        else if(newBuffer.indexOf("PNG") > -1){
            newBuffer = newBuffer.slice(newBuffer.indexOf("PNG") - 1, newBuffer.lastIndexOf("IEND") + 8);
        }
        else{
            console.log("jpeg and png not detected");
            return;
        }
        newImg.name = "image";
        newImg.img.data = newBuffer;
        newImg.img.contentType = 'image/png';
        newImg.save(function (err, newImg) {
            if (err) throw err;
        });
        //res.send(a.img.data);
      });

      app.on('close', function () {
        console.error('dropping db');
        mongoose.connection.db.dropDatabase(function () {
          console.error('closing db connection');
          mongoose.connection.close();
        });
      });

      process.on('SIGINT', function () {
        process.exit(1);
      });
    });