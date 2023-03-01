const courseRatingRoutes = require('express').Router();
const courseData = require('../courses.json');

courseRatingRoutes.get('/', (req, res) => {
  console.log(req.params);
  let courseIdPassed = req.params.courseId;
  console.log(courseIdPassed);
  let rating = courseData.kalvium.filter(course => course.courseId == courseIdPassed);
  res.status(200);
  res.send(rating);
});

module.exports = courseRatingRoutes;