#include <WiFi.h>
#include <HTTPClient.h>

// Potentiometer is connected to GPIO 15
const int potPin = 34;
const int voltPin = 32;

// variable for storing the potentiometer value
int potValue = 0;
 
const char* ssid = "DESKTOP-E8A37RP 1876";
const char* password =  "Sofie123";
 
void setup() {
 
  Serial.begin(115200);
  delay(4000);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
 
  Serial.println("Connected to the WiFi network");
  pinMode(voltPin, OUTPUT);
  digitalWrite(voltPin, HIGH);
}
 
void loop() {

 if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
   potValue = analogRead(potPin);
   Serial.println(potValue);
   HTTPClient http;   
   
   String url = "http://192.168.137.135:8080/esp32/";
   String stringThree =  url + potValue;
   http.begin(stringThree);
   http.POST("POSTING from ESP32");
   http.end();

  }

 delay(5000);
 
}
