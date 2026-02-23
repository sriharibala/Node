const express = require('express');
const router = express.Router();
const employeeController = require('../Controller/employeeController');
router.post('/create', employeeController.createEmployee);
router.post('/getallemployees', employeeController.getallemployees);
router.get('/exportemployees', employeeController.exportEmployees);
module.exports = router;