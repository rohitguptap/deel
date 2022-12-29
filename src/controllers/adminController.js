const {Op, col, fn, literal} = require("sequelize");
const {getBestProfessions, getBestClient} = require("../services/adminService");

const getBestProfession = async (req, res) => {
    const {query} = req;
    const {start, end} = query;

    const {Job: JobModel, Contract: ContractModel, Profile: ProfileModel} = req.app.get('models');
    try {
        const bestProfessions = await getBestProfessions(JobModel, ContractModel, ProfileModel, start, end);
        res.json(bestProfessions[0]);

    } catch (err) {
        res.status(500).json(err.message);
    }
}
const getBestClients = async (req, res) => {
    const {Job, Contract, Profile} = req.app.get('models');
    const {start, end, limit} = req.query
    try {
        const bestClients = await getBestClient(Job, Contract, Profile, start, end, limit);
        return res.json(bestClients)
    } catch (err) {
        res.status(500).json(err.message);
    }
}

module.exports = {getBestClients, getBestProfession};
