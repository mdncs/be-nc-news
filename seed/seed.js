const mongoose = require('mongoose');
const { Topics, Users, Articles, Comments } = require('../models');
const { formatArticles, formatComments } = require('../utils');
// const { generateRandomCommentData } = require('../utils');


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
        // works with the (now redundant) overly complicated func in utils/index.js
        // let commentData = process.env.NODE_ENV === 'test' ? require('./testData')
        //                                                   : generateRandomCommentData(articleDocs, userDocs);
        return Promise.all([
            topicDocs,
            userDocs,
            articleDocs,
            Comments.insertMany(formatComments(commentData, articleDocs, userDocs))
        ]);
    })
    // .then(([topicDocs, userDocs, articleDocs, commentDocs]) => {
    //     console.log(`👨 👩 Inserted ${userDocs.length} users. 👩 👨`);
    //     console.log(`🏢 🏢 Inserted ${topicDocs.length} topics. 🏢 🏢`);
    //     console.log(`🎬 🎥 Inserted ${articleDocs.length} articles. 🎥 🎬`);
    //     console.log(`🎬 🎥 Inserted ${commentDocs.length} comments. 🎥 🎬`);
    //     return Promise.all([topicDocs, userDocs, articleDocs, commentDocs]);
    // })
    .catch(console.log);
};


module.exports = seedDB;

