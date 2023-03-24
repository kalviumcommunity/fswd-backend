let createLocation = `create table if not exists location (
	location_id int NOT NULL AUTO_INCREMENT,
    location_name varchar(30) DEFAULT NULL,
    PRIMARY KEY (location_id)
);`;

let createDepartment = `create table if not exists department (
	department_id int NOT NULL AUTO_INCREMENT,
    department_name varchar(30) DEFAULT null,
    location_id int DEFAULT NULL,
    PRIMARY KEY (department_id),
    FOREIGN KEY(location_id) references location(location_id)
);`;

let createEmployeeInfo = `create table if not exists employee_info (
	employee_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(20) DEFAULT NULL,
    last_name varchar(25) DEFAULT NULL,
    email varchar(25) DEFAULT NULL,
    phone_no varchar(20) DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    salary int default null,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id)
);`;

let createEmployementInfo = `create table if not exists employement_info (
	id int NOT NULL AUTO_INCREMENT,
    employee_id int NOT NULL,
    department_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(department_id) REFERENCES department(department_id),
    FOREIGN KEY(employee_id) REFERENCES employee_info(employee_id)
);`;

module.exports = {createLocation, createDepartment, createEmployeeInfo, createEmployementInfo };