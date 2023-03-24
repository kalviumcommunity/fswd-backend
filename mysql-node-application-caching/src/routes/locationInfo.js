const locationRoutes = require('express').Router();
const bodyParser = require('body-parser');
const con = require('../database/db');
const verifyToken = require('../middleware/auth');


locationRoutes.use(bodyParser.urlencoded({ extended: false }));
locationRoutes.use(bodyParser.json());

locationRoutes.get('/:locationName', (req,res) => {
  let locationName = req.params.locationName;
  let data;
  var sql = "SELECT * from location where location_name = ?"
  con.query(sql, [locationName], function(err, result) {
    if (err) throw err;
    data = result;
    return res.status(200).json(data)
  });
});

locationRoutes.get('/:locationName/averageSalary', (req,res) => {
  let locationName = req.params.locationName;
  let data;
  var sql = `select location_name, avg(salary) from (
    select distinct(employee_id), salary, location_name from (
      select eyi.employee_id, di.location_id, li.location_name, ei.salary from employement_info eyi inner join employee_info ei on eyi.employee_id = ei.employee_id
      inner join department di on di.department_id = eyi.department_id inner join location li on di.location_id = li.location_id
    ) as results
  ) as finals
  where location_name = ? group by location_name;`;
  con.query(sql, [locationName], function(err, result) {
    if (err) throw err;
    data = result;
    return res.status(200).json(data)
  });
});

module.exports = locationRoutes;