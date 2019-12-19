/* global Module */

/* Magic Mirror
 * Module: MMM-syslog
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const url = require("url");
const fs = require("fs");
const jsonFile = '/home/pi/MagicMirror/modules/MMM-Server/data.json';
module.exports = NodeHelper.create({

  start: function() {
    
    this.initialise();

           
      
  },
  
  socketNotificationReceived: function(notification, payload) {
    var self = this;
    switch(notification) {
      case "MMM-Server_INIT":
        fs.readFile(jsonFile, 'utf8', function(err, contents) {
          this.data = JSON.parse(contents);
          self.sendSocketNotification("UPDATE", data)
          
        }); 
        
        break
    }
  },
  
  initialise: function() {
    var self = this;
           
    
    
    //Json viewer
    this.expressApp.get('/data', function (req, res) {
      fs.readFile(jsonFile, 'utf8', function(err, contents) {
        this.data = JSON.parse(contents);
        res.send(data)
      });    
    });
    
    //Json viewer
    this.expressApp.post('/ledchange/:direction', function (req, res) {
      var data;
        fs.readFile(jsonFile, 'utf8', function(err, contents) {
          data = JSON.parse(contents);
          var colors = {
          "down" : {
                    "red" : "blue",
                    "blue": "green",
                    "green": "lightblue",
                    "lightblue": "purple",
                    "purple": "yellow-green",
                    "yellow-green": "white",
                    "white": "off",
                    "off" : "red",
                    },
          "up" :    {
                    "blue": "red",
                    "green": "blue",
                    "lightblue": "green",
                    "purple": "lightblue",
                    "yellow-green": "purple",
                    "white": "yellow-green",
                    "off": "white",
                    "red": "off",
                    }
          }
          
          data["color"] = colors[req.params.direction][data["color"]];

          
          self.sendSocketNotification("UPDATE", data);
          fs.writeFile(jsonFile, JSON.stringify(data, null, 2), finished );
          function finished(err) {
            res.send("color changed " + req.params.direction)
          }
      });     
    });
    
    //Json value update/post
    this.expressApp.route('/:key/:value')
    .post(function (req, res) {
      var data;
        fs.readFile(jsonFile, 'utf8', function(err, contents) {
          data = JSON.parse(contents);
          
          if(isNaN(req.params.value)) {
            data[req.params.key] = req.params.value;
          }
          else {
            data[req.params.key] = JSON.parse(req.params.value);
          }
          self.sendSocketNotification("UPDATE", data);
          fs.writeFile(jsonFile, JSON.stringify(data, null, 2), finished );
          function finished(err) {
            res.send("post");
          }
      });    
    })
    .put(function (req, res) {
      var data;
        fs.readFile(jsonFile, 'utf8', function(err, contents) {
          data = JSON.parse(contents);
          data[req.params.key] = req.params.value;
          self.sendSocketNotification("UPDATE", data);
          fs.writeFile(jsonFile, JSON.stringify(data, null, 2), finished );
          function finished(err) {
            res.send("post");
          }
      });    
    });

    
    //Json value view
    this.expressApp.route('/:key')
    .get( function (req, res) {         
    fs.readFile(jsonFile, 'utf8', function(err, contents) {
        var data = JSON.parse(contents);
        var para = req.params;
        if(data.hasOwnProperty(para.key)){
          res.json(data[para.key]);
        }
        else{
          res.send("key not found");
        }       
      });    
     })
     .delete(function (req, res) {
      var data;
        fs.readFile(jsonFile, 'utf8', function(err, contents) {
          data = JSON.parse(contents);
          if(data.hasOwnProperty(req.params.key)){
          delete data[req.params.key];
          }
          fs.writeFile(jsonFile, JSON.stringify(data, null, 2), finished );
          function finished(err) {
            res.send("delete");
          }
      });    
    }); 
      
 
    

    
    
    //file listener
    fs.watchFile(jsonFile, (curr, prev) => {
    console.log(jsonFile + ' file Changed');      
      fs.readFile(jsonFile, 'utf8', function(err, contents) {
        var data = JSON.parse(contents);
        //self.sendSocketNotification("I_DID", data);
      });
    });
      
    
    
  },

});