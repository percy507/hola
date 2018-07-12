/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Set environment for development
process.env.NODE_ENV = 'development';

// Install `electron-debug`
require('electron-debug')({ showDevTools: false });

require('electron').app.on('ready', () => {
  let installExtension = require('electron-devtools-installer');

  // Install `vue-devtools`
  installExtension
    .default(installExtension.VUEJS_DEVTOOLS)
    .then(extension => {
      console.log(`${extension} installed successfull!`);
    })
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err);
    });

  // Install `devtron`
  require('devtron').install();
});

// Require `main` process to boot app
require('./index');
