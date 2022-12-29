const {Op} = require("sequelize");

const getNotTerminatedJobs = async (Job, Contract, profile) => {
    return await Job.findAll({
        where: {paid: {[Op.not]: true}},
        include: [{
            model: Contract,
            where: {
                ClientId: {[Op.eq]: profile.id},
                [Op.and]: [{status: {[Op.not]: "terminated"}}],
            },
        }]
    });
}
module.exports =  {getNotTerminatedJobs};
