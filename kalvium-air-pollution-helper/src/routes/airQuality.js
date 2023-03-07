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
    airQualityCallback(`${url}?${searchParams}`, function(err, resp) {
        if(err) {
          res.status(500).json({error: err});
          console.log(err);
        } else {
          res.status(200).json(resp);
          console.log(`Found the data for city name ${cityName} response: ${resp}`);
        }
    });
});

airQuality.get('/asyncAwait', async (req, res) => {
  let radius = req.query.radius;
  let limit = req.query.limit;
  let sortOrder = req.query.sortOrder;
  let pagesToFetch = req.query.pages;
  let totalResults = [];
  if (pagesToFetch > 3) {
    res.status(400).send("Pages to fetch cannot be greater than 3");
  }
  try {
    let payload = {radius:radius, limit:limit, sort:sortOrder, page:1};
    const searchParams = new URLSearchparams(payload);
    let resp1 = await airQualityPromise(`${url}?${searchParams}`);
    payload.page = payload.page + 1;
    const searchParams2 = new URLSearchparams(payload);
    let resp2 = await airQualityPromise(`${url}?${searchParams2}`);
    payload.page = payload.page + 1;
    const searchParams3 = new URLSearchparams(payload);
    let resp3 = await airQualityPromise(`${url}?${searchParams3}`);
    totalResults.push(resp1);
    totalResults.push(resp2);
    totalResults.push(resp3);
    res.status(200).json(totalResults);
    console.log(`Found the data for city name ${cityName} response: ${totalResults}`);
  } catch (err) {
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({error: err});
    console.log(err);
  }
});

airQuality.get('/callbackHell', (req, res) => {
  let radius = req.query.radius;
  let limit = req.query.limit;
  let sortOrder = req.query.sortOrder;
  let pagesToFetch = req.query.pages;
  let totalResults = [];
  if (pagesToFetch > 3) {
    res.status(400).send("Pages to fetch cannot be greater than 3");
  }
  let payload = {radius:radius, limit:limit, sort:sortOrder, page:1};
  const searchParams = new URLSearchparams(payload);
  airQualityCallback(`${url}?${searchParams}`, function(err, resp) {
    if(err) {
      res.status(500).json({error: err});
      console.log(err);
    } else {
      let recordsFound = resp.meta.found;
      if(recordsFound > limit) {
        payload.page = payload.page + 1;
        const searchParams2 = new URLSearchparams(payload);
        airQualityCallback(`${url}?${searchParams2}`, function(err, resp2) {
          if(err) {
            res.status(500).json({error: err});
            console.log(err);
          } else {
            let recordsFound = resp2.meta.found;
            if(recordsFound > limit) {
              payload.page = payload.page + 1;
              const searchParams3 = new URLSearchparams(payload);
              airQualityCallback(`${url}?${searchParams3}`, function(err, resp3) {
                if(err) {
                  res.status(500).json({error: err});
                  console.log(err);
                } else {
                  totalResults.push(resp);
                  totalResults.push(resp2);
                  totalResults.push(resp3);
                  res.status(200).json(totalResults);
                  console.log(`Found the data for city name ${cityName} response: ${totalResults}`);
                }
              });
            }
          }
        });
      }
    }
  })
})

airQuality.get('/:cityName/promise', (req, res) => {
  let cityName = req.params.cityName;
  let radius = req.query.radius;
  let limit = req.query.limit;
  let sortOrder = req.query.sortOrder;
  let payload = {city:capitalizeFirstLetter(cityName), radius:radius, limit:limit, sort:sortOrder};
  const searchParams = new URLSearchparams(payload);
  console.log(`${url}?${searchParams}`);
  airQualityPromise(`${url}?${searchParams}`).then(resp => {
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
    let resp = await airQualityPromise(`${url}?${searchParams}`);
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
    let resp = await airQualityPromise(`${url}?${searchParams}`);
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