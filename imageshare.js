var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
require('dotenv').config({path: __dirname + '/.env'});
var Schema = mongoose.Schema;

var app = express();

mongoose.connect("mongodb+srv://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PASSWORD + "@cluster0-hjxlu.gcp.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});

function errored(){
    console.log("couldnt connect, exitting");
    process.exit(1);
}

var schema = new Schema({
    name: String,
    img: { data: Buffer, contentType: String }
});

var A = mongoose.model('A', schema);

mongoose.connection.on('open', function () {
  console.error('mongo is open');

      app.listen(8080)
      app.use(bodyParser.raw( { type: "*/*", limit: '18mb' }));
      app.get('/i/', function (req, res, next) {
        res.sendFile("index.html", {root: __dirname });
      });

      app.get('/i/:imgname', function (req, res, next) {
        console.log(req.params.imgname);
        A.findOne({name: req.params.imgname}, function (err, doc) {
            if (doc == null) {
                return;
            }
            else {
                res.contentType(doc.img.contentType);
                res.send(doc.img.data);
            }
        });
      });
      app.post("/upload.php", function (req, res) {
        var newImg = new A;
        var newBuffer = new Buffer(req.body);
        var imageUrl = newBuffer.subarray(newBuffer.indexOf("imageurl") + 9, newBuffer.lastIndexOf("Web") - 7).toString().trim();
        if(newBuffer.indexOf("JFIF") > -1){
            newBuffer = newBuffer.slice(newBuffer.indexOf("JFIF") - 6, newBuffer.lastIndexOf("Web") - 6);
        }
        else if(newBuffer.indexOf("PNG") > -1){
            newBuffer = newBuffer.slice(newBuffer.indexOf("PNG") - 1, newBuffer.lastIndexOf("IEND") + 8);
        }
        else if(newBuffer.indexOf("Exif") > -1){
            newBuffer = newBuffer.slice(newBuffer.indexOf("Exif") - 6, newBuffer.lastIndexOf("Web") - 6);
        }
        else{
            console.log("jpeg and png not detected");
            res.send(req.body);
            return;
        }
        console.log("Image name: " + imageUrl);
        A.findOne({name: imageUrl}, function (err, doc) {
            if (doc == null) {
                newImg.name = imageUrl;
                newImg.img.data = newBuffer;
                newImg.img.contentType = 'image/png';
                newImg.save(function (err, newImg) {
                    if (err) throw err;
                });
                res.send("Successful");
            }
            else {
                res.status(500).send({error: "Image name " + imageUrl + " was already in use, try another"});
                console.log('image name already in use');
            }
        });
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

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}