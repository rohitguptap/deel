const {Op, fn, col, literal} = require("sequelize");

const getBestProfessions = async (JobModel,ContractModel,ProfileModel,start,end) => {
    return JobModel.findAll({
        where: {
            paid: true,
            paymentDate: {
                [Op.between]: [new Date(start), new Date(end)]
            }
        },
        include: [
            {
                model: ContractModel,
                include: [
                    {model: ProfileModel, as: 'Contractor', attributes: []}
                ],
                attributes: []
            }
        ],
        attributes: [
            [fn('sum', col('price')), 'total'],
            [col('Contract.Contractor.profession'), 'profession']
        ],
        group: [col('Contract.Contractor.profession')],
        order: [[literal('total'), 'DESC']]
    })
}

const getBestClient = async (Job, Contract, Profile, start, end, limit) => {
    return await Job.findAll({
        where: {
            paid: true,
            paymentDate: {
                [Op.between]: [new Date(start), new Date(end)]
            }
        },
        include: [
            {
                model: Contract,
                include: [
                    {model: Profile, as: 'Client', attributes: []}
                ],
                attributes: []
            }
        ],
        order: [
            ['price', 'DESC']
        ],
        attributes: [
            [col('Job.id'), "id"], [col('Contract.Client.firstName'), 'firstName'], [col('Contract.Client.lastName'), 'lastName'], 'price'
        ],
        limit: limit ? limit : 2
    })
}
module.exports = {getBestProfessions, getBestClient};
