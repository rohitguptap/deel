const {Op} = require("sequelize");

const findUnPaidJobs = async (Contract, Job, profile) => {
    return await Job.findAll({
        where: {paid: {[Op.not]: true}},
        include: [{
            model: Contract,
            where: {
                [Op.or]: [{ClientId: {[Op.eq]: profile.id}}, {ContractorId: {[Op.eq]: profile.id}}],
                [Op.and]: [{status: {[Op.eq]: 'in_progress'}}],
            },
        }]
    });
    ;
}

const findJobsByClientId = async (Contract, Job, profile, jobId) => {
    return Job.findOne({
        where: {paid: {[Op.not]: true}, id: jobId},
        include: [{
            model: Contract,
            where: {
                ClientId: {[Op.eq]: profile.id},
                [Op.and]: [{status: {[Op.eq]: 'in_progress'}}],
            },
        }]
    });
}
module.exports = {findUnPaidJobs, findJobsByClientId};
