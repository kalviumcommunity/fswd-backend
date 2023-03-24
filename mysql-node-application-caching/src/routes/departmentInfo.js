const departmentRoutes = require('express').Router();
const bodyParser = require('body-parser');
const con = require('../database/db');


departmentRoutes.use(bodyParser.urlencoded({ extended: false }));
departmentRoutes.use(bodyParser.json());

departmentRoutes.get('/:departmentName', (req,res) => {
  let departmentName = req.params.departmentName;
  let data;
  var sql = "SELECT * from department where department_name = ?"
  con.query(sql, [departmentName], function(err, result) {
    if (err) throw err;
    data = result;
    return res.status(200).json(data)
  });
});

module.exports = departmentRoutes;