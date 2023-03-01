const courseRoutes = require('express').Router();
const courseData = require('../courses.json');
const validator = require('../helpers/validator');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require("fs");

courseRoutes.use(bodyParser.urlencoded({ extended: false }));
courseRoutes.use(bodyParser.json());


courseRoutes.get('/:courseId/averageRating', (req, res) => {
  let kalviumCourse = courseData.kalvium;
  let courseIdPassed = req.params.courseId;

  let result = kalviumCourse.filter(val => val.courseId == courseIdPassed);

  res.status(200);
  res.send({
      "averageRating" : result[0].averageRating,
      "courseId": courseIdPassed
    });
});

courseRoutes.post('/', (req, res) => {
  const courseDetails = req.body;
  console.log(req.body);
  let writePath = path.join(__dirname, '..', 'courses.json')
  if(validator.validateCourseInfo(courseDetails)) {
    let courseDataModified = JSON.parse(JSON.stringify(courseData));
    courseDataModified.kalvium.push(courseDetails);
    fs.writeFileSync(writePath, JSON.stringify(courseDataModified), {encoding:'utf8', flag:'w'});
    res.status(200);
    res.json("Course info has been successfully added to the available courses");
  } else {
    res.status(400);
    res.send("Course Info is malformed please provide all the properties");
  }
});

courseRoutes.get('/', (req, res) => {
  res.status(200);
  res.send(courseData);
});

courseRoutes.get('/:courseId', (req, res) => {
  let kalviumCourse = courseData.kalvium;
  let courseIdPassed = req.params.courseId;
  let result = kalviumCourse.filter(val => val.courseId == courseIdPassed);

  res.status(200);
  res.send(result);
})

module.exports = courseRoutes;