import AppUser from '../models/AppUserModel';
import TrainingStaff from '../models/TrainingStaffModel';
import Trainer from '../models/TrainerModel';

const ListStaffAdmin = (req, res, next) => {
  AppUser.find({role: 'staff'})
      .exec()
      .then((user) => {
        res.render('admin_staff', {user: user});
      })
      .catch((err) => console.log(err));
};

const AddStaffAdmin = async (req, res, next) => {
  const {usr, pwd, name, email, phone} = req.body;
  AppUser.findOne({username: usr}).exec((err, user) => {
    if (err) {
      return console.log(err);
    } else if (user) {
      const msg = 'This user has already exist';
      return res.redirect(`/admin/add_staff?msg=${msg}`);
    }
  });

  const newUser = new AppUser({
    username: usr,
    password: pwd,
    role: 'staff',
  });

  await newUser.save();

  AppUser.findOne({username: usr}).exec(async (err, user) => {
    if (err) {
      return console.log(err);
    } else {
      const newStaff = new TrainingStaff({
        name: name,
        email: email,
        phone: phone,
        account_id: user._id,
      });

      await newStaff.save();

      return res.redirect('/users/admin/list_all_staff');
    }
  });
};

const UpdateStaffAdmin = (req, res, next) => {
  let user = {};
  let info = {};
  const {_id} = req.body;

  AppUser.findOne({_id: _id})
      .exec()
      .then((value) => {
        user = {
          _id: value._id,
          username: value.username,
        };
        TrainingStaff.findOne({account_id: _id})
            .exec()
            .then((value) => {
              info = {
                name: value.name,
                email: value.email,
                phone: value.phone,
              };

              res.render('admin_update_staff', {
                data: {
                  user: user,
                  info: info,
                },
              });
            })
            .catch((err) => {
              console.log(err);
              res.redirect('/users/admin/list_all_staff');
            });
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/users/admin/list_all_staff');
      });
};

const UpdateStaffInfoAdmin = (req, res, next) => {
  const {name, email, phone, _id} = req.body;
  const newValue = {};
  if (name) {
    newValue.name = name;
  }
  if (email) {
    newValue.email = email;
  }
  if (phone) {
    newValue.phone = phone;
  }
  TrainingStaff.findOneAndUpdate(
      {account_id: _id},
      {$set: newValue},
      (err, data) => {
        if (err) {
          console.log(err);
          return res.render('admin_update_staff_info');
        } else {
          console.log(data);
          return res.redirect('/users/admin/list_all_staff');
        }
      },
  );
};

const UpdateStaffAccountAdmin = (req, res, next) => {
  const {usr, pwd, _id} = req.body;
  const newValue = {};
  if (usr) newValue.username = usr;
  if (pwd) newValue.password = pwd;

  AppUser.findOneAndUpdate(
      {_id: _id},
      {$set: newValue},
      {new: true},
      (err, data) => {
        if (err) {
          console.log(err);
          return res.render('admin_update_staff_account');
        } else {
          console.log(data);
          return res.redirect('/users/admin/list_all_staff');
        }
      },
  );
};

const DeleteStaffAdmin = async (req, res, next) => {
  const {_id} = req.body;
  await AppUser.findOneAndRemove({_id: _id}, (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/users/admin/list_all_staff');
    } else {
      console.log('OK');
      return res.redirect('/users/admin/list_all_staff');
    }
  });

  TrainingStaff.findByIdAndRemove({account_id: _id}, (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/users/admin/list_all_staff');
    } else {
      console.log('OK');
      return res.redirect('/users/admin/list_all_staff');
    }
  });
};

const ListTrainerAdmin = (req, res, next) => {
  AppUser.find({role: 'trainer'})
      .exec()
      .then((user) => {
        res.render('admin_trainer', {user: user});
      })
      .catch((err) => console.log(err));
};

const AddTrainerAdmin = async (req, res, next) => {
  const {usr, pwd, name, email, phone, place, type} = req.body;
  AppUser.findOne({username: usr}).exec((err, user) => {
    if (err) {
      return console.log(err);
    } else if (user) {
      const msg = 'This user has already exist';
      return res.redirect(`/users/admin/add_trainer?msg=${msg}`);
    }
  });

  const newUser = new AppUser({
    username: usr,
    password: pwd,
    role: 'trainer',
  });

  await newUser.save();

  AppUser.findOne({username: usr}).exec(async (err, user) => {
    if (err) {
      return console.log(err);
    } else {
      const newTrainer = new Trainer({
        name: name,
        email: email,
        phone: phone,
        working_place: place,
        type: type,
        account_id: user._id,
      });

      await newTrainer.save();

      return res.redirect('/users/admin/list_all_trainer');
    }
  });
};

const UpdateTrainerAdmin = (req, res, next) => {
  let user = {};
  let info = {};
  const {_id} = req.body;

  AppUser.findOne({_id: _id})
      .exec()
      .then((value) => {
        user = {
          _id: value._id,
          username: value.username,
        };
        Trainer.findOne({account_id: _id})
            .exec()
            .then((value) => {
              info = {
                name: value.name,
                email: value.email,
                phone: value.phone,
                place: value.working_place,
                type: value.type === 'Internal' ? true : false,
              };

              res.render('admin_update_trainer', {
                data: {
                  user: user,
                  info: info,
                },
              });
            })
            .catch((err) => {
              console.log(err);
              res.redirect('/users/admin/list_all_trainer');
            });
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/users/admin/list_all_trainer');
      });
};

const UpdateTrainerInfoAdmin = (req, res, next) => {
  const {name, email, phone, place, type, _id} = req.body;
  const newValue = {};
  if (name) {
    newValue.name = name;
  }
  if (email) {
    newValue.email = email;
  }
  if (phone) {
    newValue.phone = phone;
  }
  if (place) {
    newValue.working_place = place;
  }
  if (type) {
    newValue.type = type;
  }
  Trainer.findOneAndUpdate(
      {account_id: _id},
      {$set: newValue},
      (err, data) => {
        if (err) {
          console.log(err);
          return res.render('admin_update_trainer');
        } else {
          console.log(data);
          return res.redirect('/users/admin/list_all_trainer');
        }
      },
  );
};

const UpdateTrainerAccountAdmin = (req, res, next) => {
  const {usr, pwd, _id} = req.body;
  const newValue = {};
  if (usr) newValue.username = usr;
  if (pwd) newValue.password = pwd;

  AppUser.findOneAndUpdate(
      {_id: _id},
      {$set: newValue},
      {new: true},
      (err, data) => {
        if (err) {
          console.log(err);
          return res.render('admin_update_trainer');
        } else {
          console.log(data);
          return res.redirect('/users/admin/list_all_trainer');
        }
      },
  );
};

const DeleteTrainerAdmin = async (req, res, next) => {
  const {_id} = req.body;
  await AppUser.findOneAndRemove({_id: _id}, (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/users/admin/list_all_trainer');
    } else {
      console.log('OK');
      return res.redirect('/users/admin/list_all_trainer');
    }
  });

  Trainer.findByIdAndRemove({account_id: _id}, (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/users/admin/list_all_trainer');
    } else {
      console.log('OK');
      return res.redirect('/users/admin/list_all_trainer');
    }
  });
};

export {
  ListStaffAdmin,
  AddStaffAdmin,
  UpdateStaffAdmin,
  UpdateStaffInfoAdmin,
  UpdateStaffAccountAdmin,
  DeleteStaffAdmin,
  ListTrainerAdmin,
  AddTrainerAdmin,
  UpdateTrainerAdmin,
  UpdateTrainerInfoAdmin,
  UpdateTrainerAccountAdmin,
  DeleteTrainerAdmin,
};
