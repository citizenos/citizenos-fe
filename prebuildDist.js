'use strict';

const config = require('config');
const fs = require('fs');
const path = require('path');

const configFe = config.util.loadFileConfigs(__dirname + '/src/assets/config');
const pathDistSettings = path.resolve(__dirname + '/dist/citizenos-fe/browser/assets/config/config.json');

try {
  /*  const settingsFileTxt = '(function (window) { window.__config = window.__config || {};';
    _(configFe).forEach(function (value, key) {
        settingsFileTxt += ' window.__config.' + key + ' = ' + JSON.stringify(value) + ';';
    });
    settingsFileTxt += '}(this));';*/
    fs.writeFileSync(pathDistSettings, JSON.stringify(configFe));
} catch (err) {
    console.log('config.ts write FAILED to ' + pathDistSettings, err);
    process.exit(1);
}
