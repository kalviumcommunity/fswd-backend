const airQuality = require('express').Router();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require("fs");
const URLSearchparams = require('url-search-params');
const {capitalizeFirstLetter, ensureDirectoryExistence} = require('../helpers/helper');
const axios = require('axios');
const {airQualityCallback, airQualityPromise} = require('../controllers/airQualityController');

airQuality.use(bodyParser.urlencoded({ extended: false }));
airQuality.use(bodyParser.json());

let url = 'https://api.openaq.org/v2/latest';

airQuality.get('/:cityName/callback', (req, res) => {
    let cityName = req.params.cityName;
    let radius = req.query.radius;
    let limit = req.query.limit;
    let sortOrder = req.query.sortOrder;
    let payload = {city:capitalizeFirstLetter(cityName), radius:radius, limit:limit, sort:sortOrder};
    const searchParams = new URLSearchparams(payload);
    console.log(`${url}?${searchParams}`);
    airQualityCallback(url, function(err, resp) {
        if(err) {
          res.status(500).json({error: err});
          console.log(err);
        } else {
          res.status(200).json(resp);
          console.log(`Found the data for city name ${cityName} response: ${resp}`);
        }
    });
});

airQuality.get('/:cityName/promise', (req, res) => {
  let cityName = req.params.cityName;
  let radius = req.query.radius;
  let limit = req.query.limit;
  let sortOrder = req.query.sortOrder;
  let payload = {city:capitalizeFirstLetter(cityName), radius:radius, limit:limit, sort:sortOrder};
  const searchParams = new URLSearchparams(payload);
  console.log(`${url}?${searchParams}`);
  airQualityPromise(url).then(resp => {
    console.log(`Found the data for city name ${cityName} response: ${resp}`);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(resp);
  }).catch(err => {
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({error: err});
    console.log(err);
  });
});

airQuality.get('/:cityName/asyncAwait', async (req, res) => {
  let cityName = req.params.cityName;
  let radius = req.query.radius;
  let limit = req.query.limit;
  let sortOrder = req.query.sortOrder;
  let payload = {city:capitalizeFirstLetter(cityName), radius:radius, limit:limit, sort:sortOrder};
  const searchParams = new URLSearchparams(payload);
  console.log(`${url}?${searchParams}`);
  try {
    let resp = await airQualityPromise(url);
    console.log(`Found the data for city name ${cityName} response: ${resp}`);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(resp);
  } catch (err) {
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({error: err});
    console.log(err);
  }
});

airQuality.get('/:cityName/asyncAwait/writeData', async (req, res) => {
  let cityName = req.params.cityName;
  let radius = req.query.radius;
  let limit = req.query.limit;
  let sortOrder = req.query.sortOrder;
  let payload = {city:capitalizeFirstLetter(cityName), radius:radius, limit:limit, sort:sortOrder};
  const searchParams = new URLSearchparams(payload);
  console.log(`${url}?${searchParams}`);
  try {
    let resp = await airQualityPromise(url);
    console.log(`Found the data for city name ${cityName} response: ${resp}`);
    res.setHeader('Content-Type', 'application/json');
    ensureDirectoryExistence(`../../airQuality/${cityName}/quality-data.json`);
    fs.writeFileSync(`../../airQuality/${cityName}/quality-data.json`, JSON.stringify(resp), { encoding: 'utf8', flag: 'w' });
    res.status(200).json(resp);
  } catch (err) {
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({error: err});
    console.log(err);
  }

})

module.exports = airQuality;