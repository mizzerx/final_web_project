import AppUser from '../models/AppUserModel';
import CourseCategory from '../models/CourseCategoryModel';
import Course from '../models/CourseModel';
import Topic from '../models/TopicModel';
import Trainee from '../models/TraineeModel';
import Trainer from '../models/TrainerModel';


// Trainer
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

// Trainee
const ListTraineeStaff = (req, res, next) => {
  AppUser.find({role: 'trainee'})
      .exec()
      .then((user) => {
        res.render('staff_trainee', {user: user});
      })
      .catch((err) => console.log(err));
};

const AddTraineeStaff = async (req, res, next) => {
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
};

const UpdateTraineeStaff = (req, res, next) => {
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
};

const UpdateTraineeInfoStaff = (req, res, next) => {
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
};

const UpdateTraineeAccountStaff = (req, res, next) => {
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
};

const DeleteTraineeStaff = async (req, res, next) => {
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
};

// Topic
const ListTopicStaff = (req, res, next) => {
  Topic.find({})
      .exec()
      .then((topic) => {
        res.render('staff_topic', {topic: topic});
      })
      .catch((err) => console.log(err));
};

const AddTopicStaff = (req, res, next) => {
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
};

const UpdateTopicStaff = (req, res, next) => {
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
};

const PUTUpdateTopicStaff = (req, res, next) => {
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
};

const DeleteTopicStaff = (req, res, next) => {
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
};

// Course
const ListCourseStaff = (req, res, next) => {
  Course.find({})
      .exec()
      .then((course) => {
        res.render('staff_course', {course: course});
      })
      .catch((err) => console.log(err));
};

const AddCourseStaff = (req, res, next) => {
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
};

const UpdateCourseStaff = (req, res, next) => {
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
};

const PutUpdateCourseStaff = (req, res, next) => {
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
};

const DeleteCourseStaff = (req, res, next) => {
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
};

// Category
const ListCategoryStaff = (req, res, next) => {
  CourseCategory.find({})
      .exec()
      .then((category) => {
        res.render('staff_category', {category: category});
      })
      .catch((err) => console.log(err));
};

const AddCategoryStaff = (req, res, next) => {
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
};

const UpdateCategoryStaff = (req, res, next) => {
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
};

const PutUpdateCategoryStaff = (req, res, next) => {
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
};

const DeleteCategoryStaff = (req, res, next) => {
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
};

// Assign methods
const AssignCourseForTopic = (req, res, next) => {
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
};

const AssignCategoryForCourse = (req, res, next) => {
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
};

const AssignCourseForTrainee = (req, res, next) => {
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
};

const AssignTopicForTrainer = (req, res, next) => {
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
};

export {
  ListTrainerStaff,
  AddTrainerStaff,
  UpdateTrainerStaff,
  UpdateTrainerInfoStaff,
  UpdateTrainerAccountStaff,
  DeleteTrainerStaff,
  ListTraineeStaff,
  AddTraineeStaff,
  UpdateTraineeStaff,
  UpdateTraineeInfoStaff,
  UpdateTraineeAccountStaff,
  DeleteTraineeStaff,
  ListTopicStaff,
  AddTopicStaff,
  UpdateTopicStaff,
  PUTUpdateTopicStaff,
  DeleteTopicStaff,
  ListCourseStaff,
  AddCourseStaff,
  UpdateCourseStaff,
  PutUpdateCourseStaff,
  DeleteCourseStaff,
  ListCategoryStaff,
  AddCategoryStaff,
  UpdateCategoryStaff,
  PutUpdateCategoryStaff,
  DeleteCategoryStaff,
  AssignCourseForTopic,
  AssignCategoryForCourse,
  AssignCourseForTrainee,
  AssignTopicForTrainer,
};
