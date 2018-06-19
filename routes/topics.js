const router = require('express').Router();
const { 
    getTopics, 
    getArticlesByTopicId, 
    addArticle
 } = require('../controllers/topicsC');

router.get('/', getTopics);
router.get('/:topic_id/articles', getArticlesByTopicId);
router.post('/:topic_id/articles', addArticle);


module.exports = router;