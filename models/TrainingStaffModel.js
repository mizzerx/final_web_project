const mongoose = require('mongoose');

const TrainingStaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: Number,
    maxlength: 10,
    default: -1,
  },
  account_id: mongoose.Schema.Types.ObjectId,
});

const TrainingStaff = mongoose.model('TrainingStaff', TrainingStaffSchema);

module.exports = TrainingStaff;
