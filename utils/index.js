const { random, sample } = require('lodash');
const faker = require('faker');

const makeReferenceIdObject = (docs, key) => {
    return docs.reduce((acc, val) => {
        acc[val[key]] = val._id;
        return acc;
    }, {});
}

const makeNamesArray = (docs, key) => docs.map(doc => doc[key]);

const makeIdsArray = (docs) => docs.map(doc => doc._id);

const makeReferenceNameObject = (docs, key) => {
    return docs.reduce((acc, val) => {
        acc[val._id] = val[key];
        return acc;
    }, {});
}

exports.formatArticles = (articleData, topicDocs, userDocs) => {

    const topicIds = makeReferenceIdObject(topicDocs, 'slug');
    const userIds = makeIdsArray(userDocs);
    return articleData.map(article => ({...article, belongs_to: topicIds[article.topic], votes: random(100), created_by: sample(userIds)}));
}

exports.formatComments = (commentData, articleDocs, userDocs) => {

    const articleIds = makeReferenceIdObject(articleDocs, 'title');
    const userIds = makeReferenceIdObject(userDocs, 'username');
    return commentData.map(comment => ({...comment, belongs_to: articleIds[comment.belongs_to], created_by: userIds[comment.created_by.toLowerCase()]}));
};

exports.generateRandomCommentData = (articleData, userData) => {
    const articleNames = makeNamesArray(articleData, 'title');
    const userNames = makeNamesArray(userData, 'username');

    return Array.from({length: random(200)}, () => {
        return {
            body: faker.lorem.paragraph(),
            belongs_to: sample(articleNames),
            created_by: sample(userNames),
            votes: random(100),
            created_at: Date.now()
        };
    });
}

// OVERLY COMPLICATED FUNC THAT WAS SIMPLIFIED ABOVE
// exports.generateRandomCommentData = (articleDocs, userDocs) => {
//     const articleIds = makeIdsArray(articleDocs);
//     const userIds = makeIdsArray(userDocs);
//     const articleTitles = makeReferenceNameObject(articleDocs, 'title');
//     const userNames = makeReferenceNameObject(userDocs, 'username');

//     return Array.from({length: random(200)}, () => {
//         return {
//             body: faker.lorem.paragraph(),
//             belongs_to: articleTitles[sample(articleIds)],
//             created_by: userNames[sample(userIds)],
//             votes: random(100),
//             created_at: Date.now()
//         };
//     });
// }