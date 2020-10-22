import AppUser from '../models/AppUserModel';
import Trainer from '../models/TrainerModel';
import Topic from '../models/TopicModel';
import Course from '../models/CourseModel';

const GetTrainerHome = (req, res, next) => {
  Trainer.findOne({account_id: req.session.userId})
      .exec()
      .then((info) => {
        console.log(info);
        AppUser.findOne({_id: req.session.userId})
            .exec()
            .then((user) => {
              res.render('trainer_home', {
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
};

const GetViewCourse = (req, res, next) => {
  const course = {};
  const topicResult = {};
  Trainer.findOne({account_id: req.session.userId}).exec((err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (!user.topic_id) {
        course.name = 'Not yet';
        course.desc = 'Not yet';
        topicResult.name = 'Not yet';
        topicResult.desc = 'Not yet';
        res.render('trainer_view_course', {data: {
          course: course,
          topic: topicResult,
        }});
      } else {
        Topic.findOne({_id: user.topic_id}).exec((err, topic) => {
          if (err) {
            console.log(err);
          } else {
            console.log(topic);
            topicResult.name = topic.name;
            topicResult.desc = topic.description;
            if (!topic.course_id) {
              course.name = 'Not yet';
              course.desc = 'Not yet';

              res.render('trainer_view_course', {data: {
                course: course,
                topic: topicResult,
              }});
            } else {
              Course.findOne({_id: topic.course_id}).exec((err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  course.name = result.name;
                  course.desc = result.description;

                  res.render('trainer_view_course', {data: {
                    course: course,
                    topic: topicResult,
                  }});
                }
              });
            }
          }
        });
      }
    }
  });
};

export {
  GetTrainerHome,
  GetViewCourse,
};
