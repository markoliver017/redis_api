const path = require('path');
const {autoload_models} = require('../../application/configurations/Main');

const models = {};


// Load each model file and add it to the models object

for(let i = 0; i < autoload_models.length; i++) {

    const modelName = autoload_models[i];
    const model = require(path.join(__dirname,'..','..','application','models', modelName));
    models[modelName] = model; 
    
}

module.exports = models;