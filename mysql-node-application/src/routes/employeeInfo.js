const employeeRoutes = require('express').Router();
const bodyParser = require('body-parser');
const con = require('../database/db');
const verifyToken = require('../middleware/auth');


employeeRoutes.use(bodyParser.urlencoded({ extended: false }));
employeeRoutes.use(bodyParser.json());

employeeRoutes.get('/:employeeId', (req,res) => {
  let employeeId = req.params.employeeId;
  let data;
  var sql = "SELECT * from employee_info where employee_id = ?"
  con.query(sql, [employeeId], function(err, result) {
    if (err) throw err;
    data = result;
    return res.status(200).json(data)
  });
});

employeeRoutes.get('/:employeeId/employmentInfo', (req,res) => {
  let employeeId = req.params.employeeId;
  var sql = `SELECT * from employement_info eia inner join employee_info ei on eia.employee_id = ei.employee_id
    inner join department di on di.department_id = eia.department_id where ei.employee_id = ?`;
   con.query(sql, [employeeId], function(err, result) {
    if (err) throw err;
    data = result;
    return res.status(200).json(data)
  });
});

module.exports = employeeRoutes;

