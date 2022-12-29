const router = require('express').Router();
const Auth = require('../middlewares/getProfile');
const {getContracts, getContractById} = require("../controllers/contractController");
const {getUnpaidJobs, pay} = require("../controllers/jobController");
const {addBalance} = require("../controllers/balanceController");
const {getBestProfession, getBestClients} = require("../controllers/adminController");


router
    .route('/contracts/:id')
    .get(Auth.getProfile, getContractById);

router
    .route('/contracts')
    .get(Auth.getProfile, getContracts);

router
    .route('/jobs/unpaid')
    .get(Auth.getProfile, getUnpaidJobs);

router
    .route('/jobs/:job_id/pay')
    .post(Auth.getProfile, pay);


router
    .route('/balances/deposit/:userId')
    .post(Auth.getProfile, addBalance);

router
    .route('/admin/best-profession')
    .get(Auth.getProfile, getBestProfession);

router
    .route('/admin/best-clients')
    .get(Auth.getProfile, getBestClients);

module.exports = router;
