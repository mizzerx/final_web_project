import {Router} from 'express';
const router = Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  const {msg} = req.query;
  res.render('index', {err: msg});
});

export default router;
