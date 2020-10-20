import AppUser from '../models/AppUserModel';
import bcrypt from 'bcrypt';

const Login = (req, res, next) => {
  const {usr, pwd} = req.body;
  AppUser.findOne({username: usr}).exec((err, user) => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    } else if (!user) {
      res.status(401);
      const msg = 'User not found';
      res.redirect(`/?msg=${msg}`);
    }

    bcrypt.compare(pwd, user.password, (err, same) => {
      if (same) {
        req.session.userId = user._id;
        req.session.isAdmin = user.role === 'admin' ? true : false;
        req.session.isStaff = user.role === 'staff' ? true : false;
        req.session.isTrainer = user.role === 'trainer' ? true : false;
        req.session.isTrainee = user.role === 'trainee' ? true : false;

        if (user.role === 'admin') {
          return res.redirect(`/users/admin/home`);
        } else if (user.role === 'staff') {
          return res.redirect(`/users/staff/home`);
        } else if (user.role === 'trainer') {
          return res.redirect(`/users/trainer/home`);
        } else {
          return res.redirect(`/users/trainee/home`);
        }
      } else {
        const msg = 'Username or Password is incorrect';
        return res.redirect(`/?msg=${msg}`);
      }
    });
  });
};

const Logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
};

export {
  Login,
  Logout,
};
