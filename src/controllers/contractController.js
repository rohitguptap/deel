const {findNotTerminatedContracts, findContractByClientOrContractorId} = require("../services/contractService");
const getContracts = async (req, res) => {
    const {profile} = req;
    try {
        const {Contract} = req.app.get('models');
        const contracts = await findNotTerminatedContracts(Contract, profile);

        res.json(contracts);
    } catch (err) {
        res.status(500).json(err.message);
    }
}
const getContractById = async (req, res) => {
    const {profile, params} = req;
    const {id} = params;
    const {Contract} = req.app.get('models');
    const contract = await findContractByClientOrContractorId(Contract, profile, id);
    if (!contract) {
        return res.status(404).json("Contract Not found");
    }
    res.json(contract);
}
module.exports = { getContractById, getContracts };
