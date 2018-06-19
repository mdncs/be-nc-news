const mongoose = require('mongoose');
const { Topics, Users, Articles, Comments } = require('../models');
const { formatArticles, formatComments } = require('../utils');


const seedDB = (topicData, userData, articleData, commentData) => {
    return mongoose.connection.dropDatabase()
    .then(() => {
        return Promise.all([
            Topics.insertMany(topicData),
            Users.insertMany(userData)
        ]);
    })
    .then(([topicDocs, userDocs]) => {
        return Promise.all([
            topicDocs,
            userDocs,
            Articles.insertMany(formatArticles(articleData, topicDocs, userDocs))
        ]);
    })
    .then(([topicDocs, userDocs, articleDocs]) => {
        return Promise.all([
            topicDocs,
            userDocs,
            articleDocs,
            Comments.insertMany(formatComments(commentData, articleDocs, userDocs))
        ]);
    })
    .catch(console.log);
};


module.exports = seedDB;

