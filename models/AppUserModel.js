import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const AppUserSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 4,
    maxlength: 50,
    required: true,
  },
  password: {
    type: String,
    minlength: 4,
    maxlength: 255,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'trainer', 'trainee'],
    default: 'trainee',
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

AppUserSchema.path('password').set((inputString) => {
  return (inputString = bcrypt.hashSync(
      inputString,
      bcrypt.genSaltSync(10),
      null,
  ));
});

const AppUser = mongoose.model('AppUser', AppUserSchema);

export default AppUser;
