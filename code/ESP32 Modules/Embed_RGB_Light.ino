#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
 
const char* ssid = "DESKTOP-E8A37RP 1876";
const char* password =  "Sofie123";
const int ledPin = 23;
const int ledPin2 = 22;
const int ledPin3 = 21; 






void setup() {
 
  Serial.begin(115200);
  delay(4000);
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
 
  Serial.println("Connected to the WiFi network");
  pinMode(ledPin, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(ledPin3, OUTPUT);
  digitalWrite(ledPin, HIGH);
  digitalWrite(ledPin2, HIGH);
  digitalWrite(ledPin3, HIGH);


  
}
 
void loop() {
 
  if ((WiFi.status() == WL_CONNECTED)) { //Check the current connection status
 
    HTTPClient http;
 
    http.begin("http://192.168.137.135:8080/data"); //Specify the URL
    int httpCode = http.GET();                                        //Make the request
 
    if (httpCode > 0) { //Check for the returning code
 
        String payload = http.getString();

        JSONVar myObject = JSON.parse(payload);
        
        if (myObject.hasOwnProperty("color")) {
          const char* color = myObject["color"];
          Serial.println(color);
          switch(*color) {
              case *"red" :
                digitalWrite(ledPin,LOW);
                digitalWrite(ledPin2,HIGH);
                digitalWrite(ledPin3,HIGH);
                break;
              case *"green" :
                digitalWrite(ledPin,HIGH);
                digitalWrite(ledPin2,LOW);
                digitalWrite(ledPin3,HIGH);
                break;
              case *"blue" :
                digitalWrite(ledPin,HIGH);
                digitalWrite(ledPin2,HIGH);
                digitalWrite(ledPin3,LOW);
                break;
              case *"yellow-green" :
                digitalWrite(ledPin,LOW);
                digitalWrite(ledPin2,LOW);
                digitalWrite(ledPin3,HIGH);
                break; 
              case *"purple" :
                digitalWrite(ledPin,LOW);
                digitalWrite(ledPin2,HIGH);
                digitalWrite(ledPin3,LOW);
                break; 
              case *"lightblue" :
                digitalWrite(ledPin,HIGH);
                digitalWrite(ledPin2,LOW);
                digitalWrite(ledPin3,LOW);
                break; 
              case *"white" :
                digitalWrite(ledPin,LOW);
                digitalWrite(ledPin2,LOW);
                digitalWrite(ledPin3,LOW);
                break; 
              default :
                digitalWrite(ledPin,HIGH);
                digitalWrite(ledPin2,HIGH);
                digitalWrite(ledPin3,HIGH);
                break;
            }

        }
        
        

      }
 
    else {
      Serial.println("Error on HTTP request");
    }
 
    http.end(); //Free the resources
  }
 
  delay(200);
 
}
