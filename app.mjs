import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from "body-parser";
import https from "node:https";

const APIKey = process.env.API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
     res.sendFile(__dirname + "/index.html");
});

app.post('/', function(req, res) {
     const city = req.body.cityInput;
     const apiKey = APIKey;
     const url = "https://api.weatherapi.com/v1/current.json?q=" + city + "&key=" + apiKey;
     https.get(url, function(response) {
          response.on("data", function(data) {
               const weatherData = JSON.parse(data);
               const temp = weatherData.current.temp_c;
               const desc = weatherData.current.condition.text;
               const icon_url = "https:" + weatherData.current.condition.icon;

               res.send("<center><h1>The Temperature in " + city + " is " + temp + " degrees.</h1><br><p>The Weather Condition currently is " + desc + "</p><br><img src=" + icon_url + " alt=image></center>");
          });
     });
})

app.listen(port, function() {
     console.log("server is running on port " + port);
});