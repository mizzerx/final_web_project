import AppUser from '../models/AppUserModel';
import Topic from '../models/TopicModel';
import Trainer from '../models/TrainerModel';

const ListTrainerStaff = (req, res, next) => {
  AppUser.find({role: 'trainer'})
      .exec()
      .then((user) => {
        res.render('staff_trainer', {user: user});
      })
      .catch((err) => console.log(err));
};

const AddTrainerStaff = async (req, res, next) => {
  const {usr, pwd, name, email, phone, place, type} = req.body;
  AppUser.findOne({username: usr}).exec((err, user) => {
    if (err) {
      return console.log(err);
    } else if (user) {
      const msg = 'This user has already exist';
      return res.redirect(`/users/staff/add_trainer?msg=${msg}`);
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

      return res.redirect('/users/staff/list_all_trainer');
    }
  });
};

const UpdateTrainerStaff = (req, res, next) => {
  let user = {};
  let info = {};
  const {_id} = req.body;

  AppUser.findOne({_id: _id})
      .exec()
      .then((value) => {
        user = {
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
              Topic.find({})
                  .exec()
                  .then((topic) => {
                    if (value.topic_id) {
                      Topic.findOne({_id: value.topic_id})
                          .exec()
                          .then((assign) => {
                            res.render('staff_update_trainer', {
                              data: {
                                _id: value._id,
                                user: user,
                                info: info,
                                assign: assign.name,
                                topic: topic,
                              },
                            });
                          })
                          .catch();
                    } else {
                      res.render('staff_update_trainer', {
                        data: {
                          _id: value._id,
                          user: user,
                          info: info,
                          topic: topic,
                        },
                      });
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
            })
            .catch((err) => {
              console.log(err);
              res.redirect('/users/staff/list_all_trainer');
            });
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/users/staff/list_all_trainer');
      });
};

const UpdateTrainerInfoStaff = (req, res, next) => {
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
          return res.render('staff_update_trainer');
        } else {
          console.log(data);
          return res.redirect('/users/staff/list_all_trainer');
        }
      },
  );
};

const UpdateTrainerAccountStaff = (req, res, next) => {
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
          return res.render('staff_update_trainer');
        } else {
          console.log(data);
          return res.redirect('/users/staff/list_all_trainer');
        }
      },
  );
};

const DeleteTrainerStaff = async (req, res, next) => {
  const {_id} = req.body;
  await AppUser.findOneAndRemove({_id: _id}, (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/users/staff/list_all_trainer');
    } else {
      console.log('OK');
      return res.redirect('/users/staff/list_all_trainer');
    }
  });

  Trainer.findByIdAndRemove({account_id: _id}, (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/users/staff/list_all_trainer');
    } else {
      console.log('OK');
      return res.redirect('/users/staff/list_all_trainer');
    }
  });
};

export {
  ListTrainerStaff,
  AddTrainerStaff,
  UpdateTrainerStaff,
  UpdateTrainerInfoStaff,
  UpdateTrainerAccountStaff,
  DeleteTrainerStaff,
};
