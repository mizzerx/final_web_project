const isAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin === true && req.session.userId) {
    return next();
  } else {
    const msg =
      'You must be logged in with admin permission to view this page.';
    return res.redirect(`/?msg=${msg}`);
  }
};

const isStaff = (req, res, next) => {
  if (req.session && req.session.isStaff === true && req.session.userId) {
    return next();
  } else {
    const msg =
      'You must be logged in with staff permission to view this page.';
    return res.redirect(`/?msg=${msg}`);
  }
};

const isTrainer = (req, res, next) => {
  if (
    (req.session && req.session.isAdmin === true) ||
    req.session.isTrainer ||
    (req.session.isStaff && req.session.userId)
  ) {
    return next();
  } else {
    const msg =
      'You must be logged in with trainer or higher permission to view this page.';
    return res.redirect(`/?msg=${msg}`);
  }
};

const isTrainee = (req, res, next) => {
  if (
    (req.session && req.session.isAdmin === true) ||
    req.session.isTrainee ||
    (req.session.isStaff && req.session.userId)
  ) {
    return next();
  } else {
    const msg =
      'You must be logged in with trainee or higher permission to view this page.';
    return res.redirect(`/?msg=${msg}`);
  }
};

module.exports = {isAdmin, isStaff, isTrainer, isTrainee};
