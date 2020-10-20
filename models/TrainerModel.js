import mongoose from 'mongoose';

const TrainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    maxlength: 10,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  working_place: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['External', 'Internal'],
    default: 'Internal',
  },
  account_id: mongoose.Schema.Types.ObjectId,
  topic_id: mongoose.Schema.Types.ObjectId,
});

const Trainer = mongoose.model('Trainer', TrainerSchema);

export default Trainer;
