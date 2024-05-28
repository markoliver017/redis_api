/* You can set your port, sessions here, and have the options to autoload your model,
    if not declared on autoload_models,
    you have to load manually by this.loadModel(modelName) in your controller ;
*/
const config = {

    port: 8088,

    mySession: {
        secret: 'secretkotoh',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 }
    },

    autoload_models: ['User_Model'],

    load_helpers: [],

}

module.exports = config;