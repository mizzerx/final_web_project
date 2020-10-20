import {Router} from 'express';
import AppUser from '../models/AppUserModel';
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
  AddCategoryStaff,
  AddCourseStaff,
  AddTopicStaff,
  AddTraineeStaff,
  AddTrainerStaff,
  AssignCategoryForCourse,
  AssignCourseForTopic,
  AssignCourseForTrainee,
  AssignTopicForTrainer,
  DeleteCategoryStaff,
  DeleteCourseStaff,
  DeleteTopicStaff,
  DeleteTraineeStaff,
  DeleteTrainerStaff,
  ListCategoryStaff,
  ListCourseStaff,
  ListTopicStaff,
  ListTraineeStaff,
  ListTrainerStaff,
  PutUpdateCategoryStaff,
  PutUpdateCourseStaff,
  PUTUpdateTopicStaff,
  UpdateCategoryStaff,
  UpdateCourseStaff,
  UpdateTopicStaff,
  UpdateTraineeAccountStaff,
  UpdateTraineeInfoStaff,
  UpdateTraineeStaff,
  UpdateTrainerAccountStaff,
  UpdateTrainerInfoStaff,
  UpdateTrainerStaff,
} from '../controllers/StaffController';
import Course from '../models/CourseModel';
import Topic from '../models/TopicModel';
import {Login, Logout} from '../controllers/LoginController';
import {GetTrainerHome, GetViewCourse} from '../controllers/TrainerController';
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
router.post('/login', Login);

router.get('/logout', Logout);

// Admin request
router.get('/admin/home', isAdmin, (req, res, next) => {
  res.render('admin_home');
});

// Add admin
// router.post('/admin/add_admin', (req, res, next) => {
//   const {usr, pwd} = req.body;
//   const newUser = new AppUser({
//     username: usr,
//     password: pwd,
//     role: 'admin',
//   });

//   newUser
//       .save()
//       .then((user) => {
//         res.status(200).json({
//           result: 'OK',
//           data: user,
//           message: 'Add admin successfully',
//         });
//       })
//       .catch((err) => {
//         res.status(500).json({
//           result: 'Failed',
//           data: [],
//           message: `Something went wrong. Error: ${err}`,
//         });
//       });
// });

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
router.get('/staff/list_all_trainee', isStaff, ListTraineeStaff);

router.get('/staff/add_trainee', isStaff, (req, res, next) => {
  res.render('staff_add_trainee');
});

router.post('/staff/add_trainee', isStaff, AddTraineeStaff);

router.post('/staff/update_trainee', isStaff, UpdateTraineeStaff);

router.put('/staff/update_trainee_info', isStaff, UpdateTraineeInfoStaff);

router.put('/staff/update_trainee_account', isStaff, UpdateTraineeAccountStaff);

router.delete('/staff/delete_trainee', isStaff, DeleteTraineeStaff);

// Staff - Topic
router.get('/staff/list_all_topic', isStaff, ListTopicStaff);

router.get('/staff/add_topic', isStaff, (req, res, next) => {
  const {msg} = req.query;
  res.render('staff_add_topic', {err: msg});
});

router.post('/staff/add_topic', isStaff, AddTopicStaff);

router.post('/staff/update_topic', isStaff, UpdateTopicStaff);

router.put('/staff/update_topic', isStaff, PUTUpdateTopicStaff);

router.delete('/staff/delete_topic', isStaff, DeleteTopicStaff);

// Staff - Course
router.get('/staff/list_all_course', isStaff, ListCourseStaff);

router.get('/staff/add_course', isStaff, (req, res, next) => {
  const {msg} = req.query;
  res.render('staff_add_course', {err: msg});
});

router.post('/staff/add_course', isStaff, AddCourseStaff);

router.post('/staff/update_course', isStaff, UpdateCourseStaff);

router.put('/staff/update_course', isStaff, PutUpdateCourseStaff);

router.delete('/staff/delete_course', isStaff, DeleteCourseStaff);

// Staff - Category
router.get('/staff/list_all_courseCategory', isStaff, ListCategoryStaff);

router.get('/staff/add_courseCategory', isStaff, (req, res, next) => {
  const {msg} = req.query;
  res.render('staff_add_category', {err: msg});
});

router.post('/staff/add_courseCategory', isStaff, AddCategoryStaff);

router.post('/staff/update_courseCategory', isStaff, UpdateCategoryStaff);

router.put('/staff/update_courseCategory', isStaff, PutUpdateCategoryStaff);

router.delete('/staff/delete_courseCategory', isStaff, DeleteCategoryStaff);

router.put('/staff/assign_course_topic', isStaff, AssignCourseForTopic);

router.put(
    '/staff/assign_courseCategory_course',
    isStaff,
    AssignCategoryForCourse,
);

router.put('/staff/assign_course_trainee', isStaff, AssignCourseForTrainee);

router.put('/staff/assign_topic_trainer', isStaff, AssignTopicForTrainer);

// Trainer
router.get('/trainer/home', isTrainer, GetTrainerHome);

router.get('/trainer/view_course', isTrainer, GetViewCourse);

export default router;
