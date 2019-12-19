Module.register("MMM-Server", {
  defaults: {
    temp: []
  },
  start: function () {},
  getDom: function() {
    var element = document.createElement("div");
        element.className = "myContent";
        
    var elementUL = document.createElement("ul");
        elementUL.style.listStyle = "none";
        elementUL.className = "List";
        element.appendChild(elementUL);
        
    var elementLI1 = document.createElement("li");
        elementUL.appendChild(elementLI1);
        
        var subElement1 = document.createElement("IMG");
        subElement1.id = "ICON"
        subElement1.setAttribute("src", "/modules/MMM-Server/Icons/off_lamp.png");
        subElement1.setAttribute("width", "100");
        subElement1.setAttribute("height", "100");
        elementLI1.appendChild(subElement1);
    
//    for(var i = 0; i < Object.keys(this.config.temp).length; i++){  
//      var elementLI2 = document.createElement("li");
//          elementUL.appendChild(elementLI2);  
//                  
//          var textElement = document.createElement("text");
//             textElement.id = this.config.temp[i];
//             textElement.innerHTML = this.config.temp[i] + " temp is: ";
//             elementLI2.appendChild(textElement);           
//    }
    
    for(var tSensor in this.config.temp) {
      var elementLI2 = document.createElement("li");
          elementUL.appendChild(elementLI2);  
                  
          var textElement = document.createElement("text");
             textElement.id = this.config.temp[tSensor];
             textElement.innerHTML = this.config.temp[tSensor] + " temp is: ";
             elementLI2.appendChild(textElement);       
    }       

    
    return element
  },
  
  
  notificationReceived: function(notification, payload, sender) {
    switch(notification) {
      case "DOM_OBJECTS_CREATED":
        this.sendSocketNotification("MMM-Server_INIT", payload)
        break
    }
  },
  
  
  socketNotificationReceived: function(notification, payload) {
    switch(notification) {
      case "UPDATE":
        var elem = document.getElementById("ICON")
        elem.setAttribute("src", "/modules/MMM-Server/Icons/"+payload.color+"_lamp.png");
        for(var tSensor in this.config.temp) {
          var elem = document.getElementById(this.config.temp[tSensor])
          elem.innerHTML = this.config.temp[tSensor] + " temp is: " + payload[this.config.temp[tSensor]];                
        }
        break
    }
  },
})