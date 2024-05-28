const { Admin_Model } = require('../../system/core/Admin_Model');

class User_Model extends Admin_Model {
    constructor() {
        super();
    }
    
    async get_users() {
        let query = `SELECT *, CONCAT(user_lname, ', ', user_fname, ' ', COALESCE(user_mname, '') ) as fullname
                    FROM af_userinfo`;
        return await this.getQuery(query);

    }
}

module.exports = new User_Model;
