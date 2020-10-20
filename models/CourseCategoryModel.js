import mongoose from 'mongoose';

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

export default CourseCategory;
