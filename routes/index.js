const {Router} = require('express');
const router = Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  const {msg} = req.query;
  res.render('index', {err: msg});
});

module.exports = router;
