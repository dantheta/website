const express = require('express');
const router = express.Router();
const yaml = require('yamljs');
const {check} = require('express-validator/check');
const models = require('../models');
const cors = require('cors');

const settings = yaml.load('settings.yaml');

router.get('/search/', function(req, res, next) {
  res.redirect('/');
});

router.post('/search/', [
  check('query').trim().escape(),
], function(req, res, next) {
  res.redirect('/search/' + req.body.query);
});

router.get('/search/:query', function(req, res, next) {
  let query = req.params.query;

  models.Organisation.findAll({
    where: {
      name: {
        ilike: '%' + query + '%',
      },
    },
  }).then(function(_results) {
    res.render('search/search.html', {
      settings: settings,
      query: query,
      results: _results,
    });
  });
});

router.get('/api/1/search/:query', cors(), (req, res, next) => {
  let query = req.params.query;

  models.Organisation.findAll({
    where: {
      name: {
        ilike: '%' + query + '%',
      },
    },
  }).then(function(_results) {
    let results = [];

    _results.forEach(function(result) {
      results.push({
        name: result.name,
        url: `${settings.url}/organisation/${result.registrationCountry}/`
          + `${result.registrationNumber}.json`,
      });
    });

    res.setHeader('content-type', 'application/json');
    res.status(200).send({
      query: query,
      results: results,
    });
  });
});

router.get('/api/1/search/url/:query', cors(), (req, res, next) => {
  let query = req.params.query;

  models.Organisation.findAll({
    where: {
      url: {
        ilike: query + '%',
      },
    },
  }).then(function(_results) {
    let results = [];

    _results.forEach(function(result) {
      results.push({
        name: result.name,
        url: `${settings.url}/organisation/${result.registrationCountry}/`
          + `${result.registrationNumber}.json`,
      });
    });

    res.setHeader('content-type', 'application/json');
    res.status(200).send({
      query: query,
      results: results,
    });
  });
});

module.exports = router;
