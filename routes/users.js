import {Router} from 'express';
import AppUser from '../models/AppUserModel';
import bcrypt from 'bcrypt';
import session from 'express-session';
import {isAdmin, isStaff, isTrainer} from '../middlewares/RequiresLogin';
import {
  AddStaffAdmin,
  AddTrainerAdmin,
  DeleteStaffAdmin,
  DeleteTrainerAdmin,
  ListStaffAdmin,
  ListTrainerAdmin,
  UpdateStaffAccountAdmin,
  UpdateStaffAdmin,
  UpdateStaffInfoAdmin,
  UpdateTrainerAccountAdmin,
  UpdateTrainerAdmin,
  UpdateTrainerInfoAdmin,
} from '../controllers/AdminController';
import Trainer from '../models/TrainerModel';
import TrainingStaff from '../models/TrainingStaffModel';
import {
  AddTrainerStaff,
  DeleteTrainerStaff,
  ListTrainerStaff,
  UpdateTrainerAccountStaff,
  UpdateTrainerInfoStaff,
  UpdateTrainerStaff,
} from '../controllers/StaffController';
import Trainee from '../models/TraineeModel';
import Course from '../models/CourseModel';
import Topic from '../models/TopicModel';
import CourseCategory from '../models/CourseCategoryModel';
const router = Router();

// Use Session
router.use(
    session({
      secret: 'mySecretSession',
      resave: true,
      saveUninitialized: false,
    }),
);

// GET login / logout request
router.post('/login', (req, res, next) => {
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
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// Admin request
router.get('/admin/home', isAdmin, (req, res, next) => {
  res.render('admin_home');
});

// Add admin
router.post('/admin/add_admin', (req, res, next) => {
  const {usr, pwd} = req.body;
  const newUser = new AppUser({
    username: usr,
    password: pwd,
    role: 'admin',
  });

  newUser
      .save()
      .then((user) => {
        res.status(200).json({
          result: 'OK',
          data: user,
          message: 'Add admin successfully',
        });
      })
      .catch((err) => {
        res.status(500).json({
          result: 'Failed',
          data: [],
          message: `Something went wrong. Error: ${err}`,
        });
      });
});

// Admin - Staff function
router.get('/admin/list_all_staff', isAdmin, ListStaffAdmin);

router.get('/admin/add_staff', isAdmin, (req, res, next) => {
  res.render('admin_add_staff');
});

router.post('/admin/add_staff', isAdmin, AddStaffAdmin);

router.post('/admin/update_staff', isAdmin, UpdateStaffAdmin);

router.put('/admin/update_staff_info', isAdmin, UpdateStaffInfoAdmin);

router.put('/admin/update_staff_account', isAdmin, UpdateStaffAccountAdmin);

router.delete('/admin/delete_staff', isAdmin, DeleteStaffAdmin);

// Admin - Trainer function
router.get('/admin/list_all_trainer', isAdmin, ListTrainerAdmin);

router.get('/admin/add_trainer', isAdmin, (req, res, next) => {
  res.render('admin_add_trainer');
});

router.post('/admin/add_trainer', isAdmin, AddTrainerAdmin);

router.post('/admin/update_trainer', isAdmin, UpdateTrainerAdmin);

router.put('/admin/update_trainer_info', isAdmin, UpdateTrainerInfoAdmin);

router.put('/admin/update_trainer_account', isAdmin, UpdateTrainerAccountAdmin);

router.delete('/admin/delete_trainer', isAdmin, DeleteTrainerAdmin);

// Staff request
router.get('/staff/home', isStaff, (req, res, next) => {
  let user = {};
  let info = {};
  AppUser.findOne({_id: req.session.userId})
      .exec()
      .then((value) => {
        console.log(value);
        user = {
          username: value.username,
        };

        TrainingStaff.findOne({account_id: req.session.userId})
            .exec()
            .then((value) => {
              console.log(value);
              info = {
                name: value.name,
                email: value.email,
                phone: value.phone,
              };

              res.render('staff_home', {
                data: {
                  user: user,
                  info: info,
                },
              });
            })
            .catch((err) => {
              res.send(err);
            });
      })
      .catch((err) => {
        res.send(err);
      });
});

// Staff - Trainer function
router.get('/staff/list_all_trainer', isStaff, ListTrainerStaff);

router.get('/staff/add_trainer', isStaff, (req, res, next) => {
  res.render('staff_add_trainer');
});

router.post('/staff/add_trainer', isStaff, AddTrainerStaff);

router.post('/staff/update_trainer', isStaff, UpdateTrainerStaff);

router.put('/staff/update_trainer_info', isStaff, UpdateTrainerInfoStaff);

router.put('/staff/update_trainer_account', isStaff, UpdateTrainerAccountStaff);

router.delete('/staff/delete_trainer', isStaff, DeleteTrainerStaff);

// Staff - Trainee function
router.get('/staff/list_all_trainee', isStaff, (req, res, next) => {
  AppUser.find({role: 'trainee'})
      .exec()
      .then((user) => {
        res.render('staff_trainee', {user: user});
      })
      .catch((err) => console.log(err));
});

router.get('/staff/add_trainee', isStaff, (req, res, next) => {
  res.render('staff_add_trainee');
});

router.post('/staff/add_trainee', isStaff, async (req, res, next) => {
  const {usr, pwd, name, age, gender, email, phone, score} = req.body;
  AppUser.findOne({username: usr}).exec((err, user) => {
    if (err) {
      return console.log(err);
    } else if (user) {
      const msg = 'This user has already exist';
      return res.redirect(`/users/staff/add_trainee?msg=${msg}`);
    }
  });

  const newUser = new AppUser({
    username: usr,
    password: pwd,
    role: 'trainee',
  });

  await newUser.save();

  AppUser.findOne({username: usr}).exec(async (err, user) => {
    if (err) {
      return console.log(err);
    } else {
      const newTrainee = new Trainee({
        name: name,
        age: age,
        gender: gender,
        email: email,
        phone: phone,
        TOIC_score: score,
        account_id: user._id,
      });

      await newTrainee.save();

      return res.redirect('/users/staff/list_all_trainee');
    }
  });
});

router.post('/staff/update_trainee', isStaff, (req, res, next) => {
  let user = {};
  let info = {};
  const {_id} = req.body;

  AppUser.findOne({_id: _id})
      .exec()
      .then((value) => {
        user = {
          username: value.username,
        };
        Trainee.findOne({account_id: _id})
            .exec()
            .then((value) => {
              info = {
                name: value.name,
                age: value.age,
                gender: value.gender === 'Male' ? true : false,
                email: value.email,
                phone: value.phone,
                score: value.TOIC_score,
              };
              Course.find({})
                  .exec()
                  .then((course) => {
                    if (value.course_id) {
                      Course.findOne({_id: value.course_id})
                          .exec()
                          .then((assign) => {
                            res.render('staff_update_trainee', {
                              data: {
                                _id: value._id,
                                user: user,
                                info: info,
                                assign: assign.name,
                                course: course,
                              },
                            });
                          })
                          .catch();
                    } else {
                      res.render('staff_update_trainee', {
                        data: {
                          _id: value._id,
                          user: user,
                          info: info,
                          course: course,
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
              res.redirect('/users/staff/list_all_trainee');
            });
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/users/staff/list_all_trainee');
      });
});

router.put('/staff/update_trainee_info', isStaff, (req, res, next) => {
  const {name, email, age, gender, phone, score, _id} = req.body;
  const newValue = {};
  if (name) {
    newValue.name = name;
  }
  if (age) {
    newValue.age = age;
  }
  if (gender) {
    newValue.gender = gender;
  }
  if (email) {
    newValue.email = email;
  }
  if (phone) {
    newValue.phone = phone;
  }
  if (score) {
    newValue.TOIC_score = score;
  }
  Trainee.findOneAndUpdate(
      {account_id: _id},
      {$set: newValue},
      (err, data) => {
        if (err) {
          console.log(err);
          return res.render('staff_update_trainee');
        } else {
          console.log(data);
          return res.redirect('/users/staff/list_all_trainee');
        }
      },
  );
});

router.put('/staff/update_trainee_account', isStaff, (req, res, next) => {
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
          return res.render('staff_update_trainee');
        } else {
          console.log(data);
          return res.redirect('/users/staff/list_all_trainee');
        }
      },
  );
});

router.delete('/staff/delete_trainee', isStaff, async (req, res, next) => {
  const {_id} = req.body;
  await AppUser.findOneAndRemove({_id: _id}, (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/users/staff/list_all_trainee');
    } else {
      console.log('OK');
      return res.redirect('/users/staff/list_all_trainee');
    }
  });

  Trainer.findByIdAndRemove({account_id: _id}, (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/users/staff/list_all_trainee');
    } else {
      console.log('OK');
      return res.redirect('/users/staff/list_all_trainee');
    }
  });
});

// Staff - Topic
router.get('/staff/list_all_topic', isStaff, (req, res, next) => {
  Topic.find({})
      .exec()
      .then((topic) => {
        res.render('staff_topic', {topic: topic});
      })
      .catch((err) => console.log(err));
});

router.get('/staff/add_topic', isStaff, (req, res, next) => {
  const {msg} = req.query;
  res.render('staff_add_topic', {err: msg});
});

router.post('/staff/add_topic', isStaff, (req, res, next) => {
  const {name, desc} = req.body;
  Topic.findOne({name: name})
      .exec()
      .then((value) => {
        if (value) {
          const msg = 'This topic is alredy exist. Try again';
          return res.redirect(`/users/staff/add_topic?msg=${msg}`);
        }
      })
      .catch((err) => {
        res.send(err);
      });

  const newTopic = new Topic({
    name: name,
    description: desc,
  });

  newTopic.save();

  return res.redirect('/users/staff/list_all_topic');
});

router.post('/staff/update_topic', isStaff, (req, res, next) => {
  const {_id} = req.body;
  Topic.findOne({_id: _id})
      .exec()
      .then((value) => {
        Course.find({})
            .exec()
            .then((course) => {
              if (value.course_id) {
                Course.findOne({_id: value.course_id})
                    .exec()
                    .then((assign) => {
                      console.log(assign);
                      res.render('staff_update_topic', {
                        data: {
                          name: value.name,
                          desc: value.description,
                          _id: value._id,
                          assign: assign.name,
                          course: course,
                        },
                      });
                    })
                    .catch();
              } else {
                res.render('staff_update_topic', {
                  data: {
                    name: value.name,
                    desc: value.description,
                    _id: value._id,
                    course: course,
                  },
                });
              }
            })
            .catch((err) => {
              res.render('staff_update_topic', {err: err});
            });
      })
      .catch((err) => {
        res.render('staff_update_topic', {err: err});
      });
});

router.put('/staff/update_topic', isStaff, (req, res, next) => {
  const {name, desc, _id} = req.body;
  const newValue = {};
  if (name) {
    newValue.name = name;
  }
  if (desc) {
    newValue.description = desc;
  }

  Topic.findByIdAndUpdate({_id: _id}, {$set: newValue}, {new: true})
      .exec()
      .then((value) => {
        console.log(value);
        res.redirect('/users/staff/list_all_topic');
      })
      .catch((err) => {
        res.send(err);
      });
});

router.delete('/staff/delete_topic', isStaff, (req, res, next) => {
  const {_id} = req.body;
  Topic.findByIdAndRemove({_id: _id})
      .exec()
      .then((value) => {
        console.log(value);
        res.redirect('/users/staff/list_all_topic');
      })
      .catch((err) => {
        res.send(err);
      });
});

// Staff - Course
router.get('/staff/list_all_course', isStaff, (req, res, next) => {
  Course.find({})
      .exec()
      .then((course) => {
        res.render('staff_course', {course: course});
      })
      .catch((err) => console.log(err));
});

router.get('/staff/add_course', isStaff, (req, res, next) => {
  const {msg} = req.query;
  res.render('staff_add_course', {err: msg});
});

router.post('/staff/add_course', isStaff, (req, res, next) => {
  const {name, desc} = req.body;
  Course.findOne({name: name})
      .exec()
      .then((value) => {
        const msg = 'This course is alredy exist. Try again';
        res.redirect(`/users/staff/add_course?msg=${msg}`);
      })
      .catch((err) => {
        res.send(err);
      });

  const newCourse = new Course({
    name: name,
    description: desc,
  });

  newCourse.save();

  return res.redirect('/users/staff/list_all_course');
});

router.post('/staff/update_course', isStaff, (req, res, next) => {
  const {_id} = req.body;
  Course.findOne({_id: _id})
      .exec()
      .then((value) => {
        CourseCategory.find({})
            .exec()
            .then((category) => {
              if (value.category_id) {
                CourseCategory.findOne({_id: value.category_id})
                    .exec()
                    .then((assign) => {
                      console.log(assign);
                      res.render('staff_update_course', {
                        data: {
                          name: value.name,
                          desc: value.description,
                          _id: value._id,
                          assign: assign.name,
                          category: category,
                        },
                      });
                    })
                    .catch();
              } else {
                res.render('staff_update_course', {
                  data: {
                    name: value.name,
                    desc: value.description,
                    _id: value._id,
                    category: category,
                  },
                });
              }
            })
            .catch((err) => {
              res.render('staff_update_course', {err: err});
            });
      })
      .catch((err) => {
        res.render('staff_update_course', {err: err});
      });
});

router.put('/staff/update_course', isStaff, (req, res, next) => {
  const {name, desc, _id} = req.body;
  const newValue = {};
  if (name) {
    newValue.name = name;
  }
  if (desc) {
    newValue.description = desc;
  }

  Course.findByIdAndUpdate({_id: _id}, {$set: newValue}, {new: true})
      .exec()
      .then((value) => {
        console.log(value);
        res.redirect('/users/staff/list_all_course');
      })
      .catch((err) => {
        res.send(err);
      });
});

router.delete('/staff/delete_course', isStaff, (req, res, next) => {
  const {_id} = req.body;
  Course.findByIdAndRemove({_id: _id})
      .exec()
      .then((value) => {
        console.log(value);
        res.redirect('/users/staff/list_all_course');
      })
      .catch((err) => {
        res.send(err);
      });
});

// Staff - Category
router.get('/staff/list_all_courseCategory', isStaff, (req, res, next) => {
  CourseCategory.find({})
      .exec()
      .then((category) => {
        res.render('staff_category', {category: category});
      })
      .catch((err) => console.log(err));
});

router.get('/staff/add_courseCategory', isStaff, (req, res, next) => {
  const {msg} = req.query;
  res.render('staff_add_category', {err: msg});
});

router.post('/staff/add_courseCategory', isStaff, (req, res, next) => {
  const {name, desc} = req.body;
  CourseCategory.findOne({name: name})
      .exec()
      .then((value) => {
        const msg = 'This course is alredy exist. Try again';
        res.redirect(`/users/staff/add_courseCategory?msg=${msg}`);
      })
      .catch((err) => {
        res.send(err);
      });

  const newCourseCategory = new CourseCategory({
    name: name,
    description: desc,
  });

  newCourseCategory.save();

  return res.redirect('/users/staff/list_all_courseCategory');
});

router.post('/staff/update_courseCategory', isStaff, (req, res, next) => {
  const {_id} = req.body;
  CourseCategory.findOne({_id: _id})
      .exec()
      .then((value) => {
        res.render('staff_update_category', {
          data: {
            name: value.name,
            desc: value.description,
            _id: value._id,
          },
        });
      })
      .catch((err) => {
        res.render('staff_update_category', {err: err});
      });
});

router.put('/staff/update_courseCategory', isStaff, (req, res, next) => {
  const {name, desc, _id} = req.body;
  const newValue = {};
  if (name) {
    newValue.name = name;
  }
  if (desc) {
    newValue.description = desc;
  }

  CourseCategory.findByIdAndUpdate(
      {_id: _id},
      {$set: newValue},
      {new: true},
  )
      .exec()
      .then((value) => {
        console.log(value);
        res.redirect('/users/staff/list_all_courseCategory');
      })
      .catch((err) => {
        res.send(err);
      });
});

router.delete('/staff/delete_courseCategory', isStaff, (req, res, next) => {
  const {_id} = req.body;
  CourseCategory.findByIdAndRemove({_id: _id})
      .exec()
      .then((value) => {
        console.log(value);
        res.redirect('/users/staff/list_all_courseCategory');
      })
      .catch((err) => {
        res.send(err);
      });
});

router.put('/staff/assign_course_topic', isStaff, (req, res, next) => {
  const {_id, course} = req.body;
  console.log(course);
  Topic.findOneAndUpdate(
      {_id: _id},
      {$set: {course_id: course}},
      {new: true},
  )
      .exec()
      .then((value) => {
        console.log(value);
        res.redirect('/users/staff/list_all_topic');
      })
      .catch((err) => {
        res.send(err);
      });
});

router.put('/staff/assign_courseCategory_course', isStaff, (req, res, next) => {
  const {_id, category} = req.body;
  console.log(category);
  Course.findOneAndUpdate(
      {_id: _id},
      {$set: {category_id: category}},
      {new: true},
  )
      .exec()
      .then((value) => {
        console.log(value);
        res.redirect('/users/staff/list_all_course');
      })
      .catch((err) => {
        res.send(err);
      });
});

router.put('/staff/assign_course_trainee', isStaff, (req, res, next) => {
  const {_id, course} = req.body;
  console.log(course, _id);
  Trainee.findOneAndUpdate(
      {_id: _id},
      {$set: {course_id: course}},
      {new: true, useFindAndModify: false},
  )
      .exec()
      .then((value) => {
        console.log(value);
        res.redirect('/users/staff/list_all_trainee');
      })
      .catch((err) => {
        res.send(err);
      });
});

router.put('/staff/assign_topic_trainer', isStaff, (req, res, next) => {
  const {_id, topic} = req.body;
  console.log(topic, _id);
  Trainer.findOneAndUpdate(
      {_id: _id},
      {$set: {topic_id: topic}},
      {new: true, useFindAndModify: false},
  )
      .exec()
      .then((value) => {
        console.log(value);
        res.redirect('/users/staff/list_all_trainer');
      })
      .catch((err) => {
        res.send(err);
      });
});

// Trainer
router.get('/trainer/home', isTrainer, (req, res, next) => {
  Trainer.findOne({account_id: req.session.userId})
      .exec()
      .then((info) => {
        console.log(info);
        AppUser.findOne({_id: req.session.userId})
            .exec()
            .then((user) => {
              res.render('trainer_home', {data: {
                user: user,
                info: info,
              }});
            })
            .catch((err) => {
              res.send(err);
            });
      })
      .catch((err) => {
        res.send(err);
      });
});

router.get('/trainer/view_course', (req, res, next) => {
  const course = {};
  Trainer.findOne({account_id: req.session.userId}).exec((err, user) => {
    if (err) {
      console.log(err);
    } else {
      Topic.findOne({_id: user.topic_id}).exec((err, topic) => {
        if (err) {
          console.log(err);
        } else {
          Course.findOne({_id: topic.course_id}).exec((err, result) => {
            if (err) {
              console.log(err);
            } else {
              course.name = result.name;
              course.desc = result.description;

              res.render('trainer_view_course', {course: course});
            }
          });
        }
      });
    }
  });
});

export default router;
