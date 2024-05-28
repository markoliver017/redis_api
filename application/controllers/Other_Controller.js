const Admin_Controller = require('../../system/core/Admin_Controller');

class Other_Controller extends Admin_Controller{

    constructor() {
        super();
    }

    async index(req, res) {
        // const result = await this.model.Sports.fetch_sports();
        // res.render('Sports/index', { sportsCategory: result });
        res.render('index');
    }

    // async indexHtml(req,res) {
    //     const result = await this.model.Sports.fetch_all();
    //     res.render('Sports/partial/results', result);
    // }

    // async search(req, res) {
    //     const post = req.body;
    //     const result = await this.model.Sports.search_players(post);
    //     res.render('Sports/partial/results', result);
    // }

}

module.exports = new Other_Controller;