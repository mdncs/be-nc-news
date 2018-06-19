const { Articles, Comments, Users } = require('../models');
const { random } = require('lodash');


exports.getArticles = (req, res, next) => {
    return Articles.find().populate('created_by').lean()
    .then(articles => {
        let count = Promise.all(articles.map(article => Comments.count({ belongs_to: article._id })));
        return Promise.all([articles, count])
    })
    .then(([articles, count]) => {
       const articlesArr = articles.map((article, index) => ({...article, comments: count[index]}))
       res.send({ articlesArr });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    return Articles.findById(article_id)
    .then (article => Promise.all([article, Comments.count({belongs_to: article_id})]))
    .then(([article, count]) => {
        if (!article) {
            return next({ status: 404, msg: 'Page not found' });
        }
        else {
            article._doc.comments = count;
            res.send({ article });
        }
    })
    .catch(err => {
        err.name === 'CastError' || 'ValidationError'
            ? next({ status: 400, msg: 'Bad Request' })
            : next(err);
    });
};

exports.upDownVoteArticle = (req, res, next) => {
    const { vote } = req.query;
    const { article_id } = req.params;
    
    const inc = vote === 'up' ? 1 : vote === 'down' ? -1 : 0;

    return Articles.findByIdAndUpdate(
        article_id,
        {$inc: { votes: inc } },
        { new: true }
    )
    .then(article => res.send({ article }))
    .catch(err => next(err));
};

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    return Comments.find({belongs_to: article_id})
    .then(comments => res.send({ comments }))
    .catch(err => {
        err.name === 'ValidationError' || err.name === 'CastError'
            ? next({ status: 400, msg: 'Bad Request' })
            : next(err);
    });
};

exports.addCommentToArticle = (req, res, next) => {
    const { body } = req.body;
    const { article_id } = req.params;
    return Users.findOne()
    .then(user => {
        return new Comments({
            body: body,
            belongs_to: article_id,
            created_at: Date.now(),
            votes: 0,
            created_by: user._id
        }).save()
    })
    .then(comment => {
        res.status(201).send({ comment })
    })
    .catch(err => {
        err.name === 'ValidationError' || err.name === 'CastError'
            ? next({ status: 400, msg: 'Bad Request' })
            : next(err);
    });
};