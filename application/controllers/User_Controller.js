const Admin_Controller = require('../../system/core/Admin_Controller');

class User_Controller extends Admin_Controller{

    constructor() {
        super();
    }

    async index(req, res) {
        const result = await this.model.User_Model.get_users();
        res.render('users', { users: result });
    }

}

module.exports = new User_Controller;