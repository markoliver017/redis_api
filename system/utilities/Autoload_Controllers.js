const fs = require('fs');
const path = require('path');
const { util_file } = require('./Framework_Utils');

const controllers = {};

// Get all files in the controllers folder. Note: fs.readdirSync reads all the files in the dir and return it as array */

const controllerFiles = fs.readdirSync(path.join(__dirname,'../../application/controllers'));

// Load each controller file and add it to the controllers object
for(let i = 0; i < controllerFiles.length; i++) {

    if(util_file.getLastIndex(controllerFiles[i], '.').getExtensionFile() == ".js") {

        const controllerName = util_file.getLastIndex(controllerFiles[i], '.').getFilename();
        const controller = require(path.join(__dirname,'../../application/controllers', controllerName));
        
        controllers[controllerName] = controller; 
    }
}

module.exports = controllers;