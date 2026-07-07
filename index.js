const express = require("express");
const path = require("path");
const axios = require("axios");

const SERVER = express();
const PORT = process.env.PORT || 2015;

const API_KEY = "2de127ea0ce130f232c365dea34d9876";

SERVER.use(express.static(path.join(__dirname, "public")));

SERVER.set("view engine", "ejs");
SERVER.set("views", path.join(__dirname, "views"));

// localhost:2015 वर direct home page open होईल
SERVER.get("/", (req, res) => {
  res.render("home");
});

// /home पण work करेल
SERVER.get("/home", (req, res) => {
  res.render("home");
});

// city search page
SERVER.get("/user", (req, res) => {
  res.render("city");
});

SERVER.get("/city", async (req, res) => {
  try {
    const city = req.query.ct;

    if (!city) {
      return res.render("Error");
    }

    const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;

    const geoResponse = await axios.get(geoURL);
    const cityDetails = geoResponse.data;

    if (!cityDetails || cityDetails.length === 0) {
      return res.render("Error");
    }

    const country = cityDetails[0].country;
    const state = cityDetails[0].state || "N/A";
    const lat = cityDetails[0].lat;
    const lon = cityDetails[0].lon;

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    const weatherResponse = await axios.get(weatherURL);
    const weatherData = weatherResponse.data;

    const weather = {
      country,
      state,
      city,
      lat,
      lon,
      weather_id: weatherData.weather[0].id,
      description: weatherData.weather[0].description,
      temp: weatherData.main.temp,
      feels_like: weatherData.main.feels_like,
      temp_min: weatherData.main.temp_min,
      temp_max: weatherData.main.temp_max,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
    };

    res.render("user", { weather });
  } catch (error) {
    console.log("Error:", error.message);
    res.render("Error");
  }
});

SERVER.listen(PORT, () => {
  console.log(`URL: http://localhost:${PORT}`);
});