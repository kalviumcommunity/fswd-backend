const employeeRoutes = require('express').Router();
const bodyParser = require('body-parser');
const con = require('../database/db');
const verifyToken = require('../middleware/auth');
const redisCon = require('../database/redis');
const redis = require('redis');
const db = redis.createClient();
db.connect().then(res => {
  console.log('Connected to redis');
});

employeeRoutes.use(bodyParser.urlencoded({ extended: false }));
employeeRoutes.use(bodyParser.json());

employeeRoutes.get('/:employeeId', async (req,res) => {
  let employeeId = req.params.employeeId;
  let data;
  var sql = "SELECT * from employee_info where employee_id = ?"
  let isEmployeeCached = await db.exists(`employee_info_${employeeId}`);
  if(isEmployeeCached == 1) {
    data = await db.get(`employee_info_${employeeId}`);
    let response = {
      'message' : `Data received from the cache`,
      'data': JSON.parse(data)
    };
    return res.status(200).json(response);
  } else {
    con.query(sql, [employeeId], async function(err, result) {
      if (err) throw err;
      data = result;
      let setCache = await db.set(`employee_info_${employeeId}`, JSON.stringify(data));
      let cacheSetMessage = setCache ? `Successfuly set the cache` : `Could not set the cache`;
      let response = {
        'message' : cacheSetMessage,
        'data': data
      };
      return res.status(200).json(response)
    });
  }
});

employeeRoutes.get('/:employeeId/employmentInfo', async (req,res) => {
  let employeeId = req.params.employeeId;
  var sql = `SELECT * from employement_info eia inner join employee_info ei on eia.employee_id = ei.employee_id
    inner join department di on di.department_id = eia.department_id where ei.employee_id = ?`;
  var isEmploymentInfoCached = await db.exists(`employment_info_${employeeId}`);
  if(isEmploymentInfoCached == 1) {
    data = await db.get(`employement_info_${employeeId}`);
    let response = {
      'message' : `Data received from the cache`,
      'data': JSON.parse(data)
    };
    return res.status(200).json(response);
  } else {
    con.query(sql, [employeeId], async function(err, result) {
      if (err) throw err;
      data = result;
      let setCache = await db.set(`employment_info_${employeeId}`, JSON.stringify(data));
      let cacheSetMessage = setCache ? `Successfuly set the cache` : `Could not set the cache`;
      let response = {
        'message' : cacheSetMessage,
        'data': data
      };
      return res.status(200).json(response);
    });
  }

});

employeeRoutes.post('/', async (req,res) => {
  const employeeDetails = req.body;
  let firstName = employeeDetails.firstName;
  let lastName = employeeDetails.lastName;
  let email = employeeDetails.email;
  let phoneNumber = employeeDetails.phoneNumber;
  let salary = employeeDetails.salary;
  let insertValues = [firstName, lastName, email, phoneNumber, salary];
  var sql = `INSERT INTO employee_info(first_name, last_name, email, phone_no, salary) values (?)`;

    con.query(sql, [insertValues], async function(err, result) {
      if (err) throw err;
      data = result;
      return res.status(200).json(data);
    });

});

employeeRoutes.post('/employmentInfo', (req, res) => {
  const employeeDetails = req.body;
  let firstName = employeeDetails.firstName;
  let lastName = employeeDetails.lastName;
  let email = employeeDetails.email;
  let departmentName = employeeDetails.departmentName;
  let location = employeeDetails.location;
  let findEmployee = `SELECT * from employee_info where first_name = ? and last_name = ? and email = ?`;
  let findLocation = `SELECT * from location where location_name = ?`;
  let checkDepartment = `SELECT * from department where department_name = ?`;
  let insertIntoLocation = `INSERT into location(location_name) values(?)`;
  let insertIntoDepartment = `INSERT into department(department_name, location_name) values(?)`;
  let insertStatement = `INSERT INTO employment_info(employee_id, department_id) values (?)`;
  con.beginTransaction(function(err) {
    if (err) { throw err; }
    con.query(findEmployee, [firstName, lastName, email], function(err, result) {
      if (err) {
        con.rollback(function() {
          throw err;
        });
      }
      console.log(result);
      if (result != undefined || result !=null) {
        console.log(`Found employee with info ${result}`);
        con.query(findLocation, location, function(err, locationResult) {
          if (err) {
            con.rollback(function() {
              throw err;
            });
          }
          if (locationResult != undefined && locationResult != null) {
            if (locationResult.length == 0){
              con.query(insertIntoLocation, location, function(err, insertIntoLocation) {

              })
            } else {
              console.log(`location result ${locationResult[0].location_name}`);
              con.commit(function(err) {
                if (err) {
                  con.rollback(function() {
                    throw err;
                  });
                }
                console.log('success!');
              });
            }
          }
        });
      } else {
        con.rollback(function() {
          throw err;
        });
      }
    });
  });
});

module.exports = employeeRoutes;

