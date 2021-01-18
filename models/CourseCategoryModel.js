const mongoose = require('mongoose');

const CouseCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
});

const CourseCategory = mongoose.model(
    'CourseCategory',
    CouseCategorySchema,
);

module.exports = CourseCategory;
