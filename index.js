'use strict';

const config = require('config');
const express = require('express');
const app = express();
const https = require('https');
const http = require('http');
const fs = require('fs');
const _ = require('lodash');
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');

//TODO: list whitelisted urls to github with description
const cspConfig = config.csp;
const cspOptions = _.cloneDeep(cspConfig);
if (cspConfig) {
  if (cspConfig.directives) {
    if (typeof cspConfig.directives === 'string') {
      cspConfig.directives = JSON.parse(cspConfig.directives);
      cspOptions.directives = {};
    }
    Object.keys(cspConfig.directives).forEach(function (key, index) {
      cspConfig.directives[key].forEach(function (value, k) {
        if (k === 0) {
          cspOptions.directives[key] = [];
        }
        if (value === 'none') {
          cspOptions.directives[key].push(NONE);
        } else if (value === 'self') {
          cspOptions.directives[key].push(SELF);
        } else if (value === 'inline') {
          cspOptions.directives[key].push(INLINE);
        } else {
          cspOptions.directives[key].push(value);
        }
      });
    });
  }

  app.use(expressCspHeader(cspOptions));
}

app.use(express.static(__dirname + '/dist/citizenos-fe/browser'));

const browserDetect = (req, res, next) => {
  const ua = req.headers['user-agent'];

  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    const IEversion = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    console.log('IEversion', IEversion);
    res.sendFile(__dirname + '/public/views/unknown_device.html');

    return res.set('Permissions-Policy', 'interest-cohort=()'); // Opt-out of Google FLoC
  }

  const trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf('rv:');
    const version = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    console.log('IE 11');
    res.sendFile(__dirname + 'src/unknown_device.html');

    return res.set('Permissions-Policy', 'interest-cohort=()'); // Opt-out of Google FLoC
  }
  // other browser

  next();
}

app.use(browserDetect);
app.get('*', browserDetect, function (req, res) {
  res.sendFile(__dirname + '/dist/citizenos-fe/browser/index.html');
  res.set('Permissions-Policy', 'interest-cohort=()'); // Opt-out of Google FLoC
});

const host = process.env.HOST || null;

const portHttp = process.env.PORT || 3000;
http.createServer(app).listen(portHttp, host, function (err, res) {
  if (err) {
    console.log('Failed to start HTTP server on port' + portHttp, err);
    return;
  }
  console.log('HTTP server listening on port ' + portHttp);
});

if (app.get('env') === 'development') {
  const portHttps = process.env.PORT_SSL || 3001;
  const options = {
    key: fs.readFileSync('./config/certs/dev.citizenos.com.key'),
    cert: fs.readFileSync('./config/certs/dev.citizenos.com.crt')
  };

  https.createServer(options, app).listen(portHttps, host, function (err, res) {
    if (err) {
      console.log('Failed to start HTTPS server on port' + portHttps, err);
      return;
    }
    console.log('HTTPS server listening on port ' + portHttps);
  });
}
