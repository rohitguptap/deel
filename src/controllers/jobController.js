const {Op} = require('sequelize');
const {findUnPaidJobs, findJobsByClientId} = require("../services/jobService");

const getUnpaidJobs = async (req, res) => {
    const {profile} = req;
    try {
        const {Job, Contract} = req.app.get('models');
        const jobs = await findUnPaidJobs(Contract, Job, profile)
        res.json(jobs);
    } catch (err) {
        res.status(500).json(err.message);
    }
}
const pay = async (req, res) => {
    const {profile, params} = req;
    const {job_id: jobId} = params;
    const {Job, Contract, Profile} = req.app.get('models');
    const job = await findJobsByClientId(Contract, Job, profile, jobId)

    if (!job) {
        return res.status(404).json("Job not found");
    }


    const clientProfile = await Profile.findOne({
        where: {id: profile.id}
    });
    const contractor = await Profile.findOne({
        where: {id: job.Contract.ContractorId}
    });

    if (clientProfile.balance >= job.price) {
        const transaction = await req.app.get('sequelize').transaction();
        try {
            const {balance: oldBalance} = clientProfile;
            await clientProfile.update({balance: (oldBalance - job.price)}, {transaction});
            await contractor.update({balance: (contractor.balance + job.price)}, {transaction});
            await transaction.commit();
            return res.json({
                oldBalance,
                currentBalance: clientProfile.balance,
                jobPrice: job.price,
            });
        } catch (err) {
            await transaction.rollback();
            return res.status(500).json(err.message);
        }
    }

    return res.status(400).json("low balance");

}
module.exports = {pay, getUnpaidJobs};
