const {Op} = require('sequelize');
const {getNotTerminatedJobs} = require("../services/balanceService");

const addBalance = async (req, res) => {
    const {profile, body} = req;
    const {amount} = body;

    try {
        const {Job, Contract, Profile} = req.app.get('models');
        const jobs = await getNotTerminatedJobs(Job, Contract, profile)
        if (!jobs || jobs.length === 0) {
            res.status(404).json();
        }

        const addJobPrices = jobs.reduce((acc, j) => acc + j.price, 0);
        const getProfile = await Profile.findOne({where: {id: profile.id}});

        const maxAmount = (addJobPrices * 25) / 100;

        if (amount < maxAmount) {
            const transaction = await req.app.get('sequelize').transaction();
            try {
                const {balance: oldBalance} = getProfile;
                await getProfile.update({balance: (oldBalance + amount)});
                await transaction.commit();
                return res.json({oldBalance, currentBalance: getProfile.balance, deposit: amount});
            } catch (err) {
                await transaction.rollback();
                return res.status(500).json(err.message);
            }
        }
        return res.status(400).json("Amount is not less than max amount");
    } catch (err) {
        return res.status(500).json(err.message);
    }
}

module.exports = {addBalance};