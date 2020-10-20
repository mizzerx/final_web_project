import createError from 'http-errors';
import express, {json, urlencoded} from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import methodOverride from 'method-override';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

const app = express();

// connect to DB
const uri =
  'mongodb+srv://admin:CuFbOCXgstySsAvb@cluster0.begsh.gcp.mongodb.net/WebDB?retryWrites=true&w=majority';
mongoose.Promise = global.Promise;
mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => console.log('Connected to DB....'))
    .catch((err) => console.log(`Connect to DB failed. Error: ${err}`));

// view engine setup
app.set('views', 'views');
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(
    methodOverride((req, res) => {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
        const method = req.body._method;
        delete req.body._method;
        return method;
      }
    }),
);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
