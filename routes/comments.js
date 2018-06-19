const router = require('express').Router();
const { getAllComments, upDownVoteComment, deleteComment } = require('../controllers/commentsC');

router.get('/', getAllComments);
router.put('/:comment_id', upDownVoteComment);
router.delete('/:comment_id', deleteComment);

module.exports = router;