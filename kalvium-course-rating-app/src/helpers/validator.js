class validator {
  static validateCourseInfo(courseInfo) {
    if(courseInfo.hasOwnProperty("course") &&
      courseInfo.hasOwnProperty("courseId") &&
      courseInfo.hasOwnProperty("cohort") &&
      courseInfo.hasOwnProperty("college") &&
      courseInfo.hasOwnProperty("semester") &&
      courseInfo.hasOwnProperty("instructor") &&
      courseInfo.hasOwnProperty("averageRating")) {
        return true;
      }
      return false;
  }
}

module.exports = validator;