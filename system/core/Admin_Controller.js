const models = require('../utilities/Autoload_Models');

class Admin_Controller {

    constructor() {
        this.model = models;
    }

    loadModel(modelName) {
        this.model[modelName] = require(`../../application/models/${modelName}`);
        return this.model[modelName];
    }

}

module.exports = Admin_Controller;