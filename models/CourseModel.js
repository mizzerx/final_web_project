import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  category_id: mongoose.Schema.Types.ObjectId,
});

const Course = mongoose.model('Course', CourseSchema);

export default Course;
