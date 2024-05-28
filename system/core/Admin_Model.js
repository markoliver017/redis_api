const {connection, bcrypt} = require('../../application/configurations/database');
const { Form_Validation } = require('../utilities/Autoload_Helper');

class Admin_Model {

    static query = undefined;
    static query_time = undefined;

    constructor() {
        this.form_validation = Form_Validation;
        this.bcrypt = bcrypt;
    }

    /* get all table row result*/
    async getQuery(query) {

        try {
            const [rows] = await connection.query(query);
            return rows;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

}

module.exports = {
    Admin_Model: Admin_Model
};