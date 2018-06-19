const router = require('express')();
const {
    getArticles,
    getArticleById,
    upDownVoteArticle,
    getCommentsByArticleId,
    addCommentToArticle
} = require('../controllers/articlesC');


router.get('/', getArticles);
router.get('/:article_id', getArticleById);
router.put('/:article_id', upDownVoteArticle);
router.get('/:article_id/comments', getCommentsByArticleId);
router.post('/:article_id/comments', addCommentToArticle);


module.exports = router;
