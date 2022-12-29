const {Op} = require("sequelize");

const findNotTerminatedContracts = async (Contract, profile) => {
    return await Contract.findAll({
        where: {
            [Op.or]: [{ClientId: {[Op.eq]: profile.id}}, {ContractorId: {[Op.eq]: profile.id}}],
            [Op.and]: [{status: {[Op.not]: "terminated"}}],
        },
    });
}

const findContractByClientOrContractorId  = async(Contract, profile,id) => {
   return await Contract.findOne({
        where: {id, [Op.or]: [{ClientId: {[Op.eq]: profile.id}}, {ContractorId: {[Op.eq]: profile.id}}]}
    });
}
module.exports = {findNotTerminatedContracts, findContractByClientOrContractorId};
