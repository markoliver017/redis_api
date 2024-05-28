const path = require('path');
const {load_helpers} = require('../../application/configurations/Main');

const helpers = {};


// Load each model file and add it to the helpers object

for(let i = 0; i < load_helpers.length; i++) {

    const helperName = load_helpers[i];
    const helper = require(path.join(__dirname,'..','..','application','helpers', helperName));
    helpers[helperName] = helper; 
}

module.exports = helpers;