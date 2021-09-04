//jshint esversion:6

const express = require("express");
const https = require("https");

require('dotenv').config();

const app= express();

app.use(express.json());
app.use(express.urlencoded({extended:true})); //code reqd to be able to start parsing or using through the body of the post request

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");


});

app.post("/", function(req, res){
    console.log(req.body.PlaceName);
    console.log("Post request received");

    const query = req.body.PlaceName;
    const appid = process.env.APP_ID;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appid + "&units=" + unit;
    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data",function(data){
            // console.log(data);
            const weatherData = JSON.parse(data); //to parse the json data we get back from the api and send it over to the browser using our Express and node modules
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconImageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<h1>The Temperature in " + query + " is " + temp + " degrees Celcius.</h1>");
            res.write("<p>Weather Description: " + weatherDescription + "</p>");
            res.write("<img src=" + iconImageUrl + ">");

            res.send();
            

        });
    });
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});
