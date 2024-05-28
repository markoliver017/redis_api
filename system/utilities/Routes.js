const express = require("express");
const router = express.Router();

/* Loads all controller under Controllers folder in this way they can access their controller and methods
*  directly to browser without setting configuarations on their routes */
const controllers = require('./Autoload_Controllers');
/* Loads all Users customize routes configurations */
const routes = require('../../application/configurations/Custom_Routes');
/* Loads needed utility functions */
const { util_route } = require("./Framework_Utils");

router.all("*", (req, res, next) => {

    const path = req.path;
    const urlRequest = util_route.splitRoute(path);
    let controllerName = urlRequest[1];
    let controller = controllers[controllerName];
    let methodName = (urlRequest.length == 2) ? "index" : urlRequest[2];
    let defaultcontroller = controllers[routes['default_controller']];
    
    /* anticipate http header request favicon and send the request to static files */
    if(urlRequest[1] == 'favicon.ico') {
        const path = require('path');
        res.sendFile(path.join(__dirname, '..', '..', 'public', 'images'));
        return;
    }

    /* if default controller defined under setConfig.js the user can access their
    *    index methods on base url 'localhost:port'
    */
    if(defaultcontroller !== undefined && urlRequest.length == 1) {
        if(util_route.isRouteExist(defaultcontroller["index"]) == "success"){
            defaultcontroller["index"](req, res, next);
        }

    /* if default controller defined under setConfig.js the user can access their
        methods under http request without calling its controller 'localhost:port/methods'
    */
    } else if(defaultcontroller !== undefined && util_route.isRouteExist(defaultcontroller[urlRequest[1]]) == "success") {
        defaultcontroller[urlRequest[1]](req, res, next);

    /* It is for the customize routes under setConfig.js they can access their controller/methods based
    *   on the object keys that the user defined on routes object 'localhost:port/routes[key]'
    */
    } else if(routes[urlRequest[1]]) {
        const routesVal = util_route.splitRoute(routes[urlRequest[1]]);
        controllerName = routesVal[1];
        methodName = routesVal[2];
        controller = controllers[controllerName];
        controller[methodName](req, res, next);

    /* Catch all http request url/path and check if the controller/method exist
    * for all the available controller under Controllers folder if no methods inputs
    * the controller looks automatically on the index method 'localhost:port/Controller/method'
    */
    } else if(controller && util_route.isRouteExist(controller[methodName]) == "success") {
        controller[methodName](req, res, next);

    /* send an error if the request path is not existing */
    } else {
        res.status(404).send("<h1>I'm sorry my friend! Url Not found!</h1>");
    }
        
});


module.exports = router;