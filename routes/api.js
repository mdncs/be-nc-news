const router = require('express')();
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const commentsRouter = require('./comments');
const usersRouter = require('./users');

router.set('view-engine', 'ejs');

router.get('/', (req, res, next) => {
  res.render('api.ejs');
});

router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('/users', usersRouter);


module.exports = router;