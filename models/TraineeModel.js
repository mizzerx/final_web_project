const mongoose = require('mongoose');

const TraineeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    default: 'Male',
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    maxlength: 10,
  },
  TOIC_score: {
    type: Number,
    min: 10,
    max: 990,
    required: true,
  },
  course_id: mongoose.Schema.Types.ObjectId,
  account_id: mongoose.Schema.Types.ObjectId,
});

const Trainee = mongoose.model('Trainee', TraineeSchema);

module.exports = Trainee;
