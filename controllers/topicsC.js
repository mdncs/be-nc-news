const { Articles, Topics, Users, Comments } = require('../models');
const { random } = require('lodash');

exports.getTopics = (req, res, next) => {
    return Topics.find()
    .then(topics => res.send({topics}))
    .catch(next);
};

exports.getArticlesByTopicId = (req, res, next) => {
    const { topic_id } = req.params;
    return Articles.find({ belongs_to: topic_id }).lean()
    .then(articles => {
        if (!articles.length) next({status: 404, msg: 'Page not found'});
        else {
            let count = Promise.all(articles.map(article => Comments.count({ belongs_to: article._id })));
            return Promise.all([articles, count]);
        }
    })
    .then(([articles, count]) => {
        const articlesArr = articles.map((article, index) => ({ ...article, comments: count[index] }))
        res.send({ articlesArr });
    })
    .catch(err => {
        err.name === 'CastError' || 'ValidationError'
            ? next({status: 400, msg: 'Bad Request'})
            : next(err);
    });
};

exports.addArticle = (req, res, next) => {
    const { title, body } = req.body;
    const { topic_id } = req.params;
    return Promise.all([
        Topics.findById(topic_id),
        Users.findOne()
    ])    
    .then(([topic, user]) => {
        if (!topic) return next({ status: 404, msg: 'Page not found' });
        else return new Articles({
            title: title,
            body: body,
            belongs_to: topic_id,
            votes: random(100),
            created_by: user._id
        }).save();
    })
    .then(article => article ? res.status(201).send({article}) : next({status: 404, msg: 'Page not found'}))
    .catch(err => {
        err.name === 'CastError' || 'ValidationError'
            ? next({status: 400, msg: 'Bad Request'})
            : next(err);
    });
};