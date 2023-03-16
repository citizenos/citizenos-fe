'use strict';

const config = require('config');
const fs = require('fs');
const path = require('path');

const configFe = config.util.loadFileConfigs(__dirname + '/src/assets/config');
const pathSettings = path.resolve('./src/assets/config/config.json');

try {
  /*  const settingsFileTxt = '(function (window) { window.__config = window.__config || {};';
    _(configFe).forEach(function (value, key) {
        settingsFileTxt += ' window.__config.' + key + ' = ' + JSON.stringify(value) + ';';
    });
    settingsFileTxt += '}(this));';*/
    fs.writeFileSync(pathSettings, JSON.stringify(configFe));
} catch (err) {
    console.log('config.ts write FAILED to ' + pathSettings, err);
    process.exit(1);
}
