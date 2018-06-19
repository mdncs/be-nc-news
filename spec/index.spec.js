const app = require('../app');
const { expect } = require('chai');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const seedDB = require('../seed/seed');
const { articleData, commentData, topicData, userData } = require('../seed/testData');


describe('/api', () => {
    let articleDocs, commentDocs, topicDocs, userDocs;
    beforeEach(() => {
        return seedDB(topicData, userData, articleData, commentData)
        .then(docs => {
            [topicDocs, userDocs, articleDocs, commentDocs] = docs;
        })
    });
    after(() => {
        return mongoose.disconnect();
    });

    it('GET returns a 404 if the request is not on /api', () => {
        return request
        .get('/apf')
        .expect(404)
        .then(res => {
            const { error } = res;
            expect(error.status).to.equal(404);
            expect(error.text).to.equal('Page not found');
        });
    });

    describe('seedDB', () => {
        it('returns the correct length of inserted documents for every collection', () => {
            expect(topicDocs.length).to.equal(2);
            expect(userDocs.length).to.equal(2);
            expect(commentDocs.length).to.equal(8);
            expect(articleDocs.length).to.equal(4);
        });

        it('checks that the topic docs inserted have certain properties', () => {
            expect(topicDocs[0]._doc).has.ownProperty('title');
            expect(topicDocs[1]._doc.slug).to.equal('cats');
        });

        it('checks that the article docs inserted have certain properties', () => {
            expect(articleDocs[0]._doc.body).to.equal('I find this existence challenging');
            expect(articleDocs[3]._doc).has.ownProperty('created_by');
        });

        it('checks that the users docs inserted have certain properties', () => {
            expect(userDocs[1]._doc).has.ownProperty('name');
            expect(userDocs[0]._doc).has.ownProperty('username');
            expect(userDocs[0]._doc.name).to.equal('jonny');
        });

        it('checks that the comment docs inserted have certain properties', () => {
            expect(commentDocs[2]._doc.body).to.equal("The owls are not what they seem.");
            expect(commentDocs[0]._doc.body).to.equal('Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — on you it works.');
        });
    });

    describe('/topics', () => {

        it('GET returns a 200 and all topics', () => {
            return request
            .get('/api/topics')
            .expect(200)
            .then(res => {
                const { topics } = res.body;
                expect(res.body).to.be.an('object');
                expect(topics[0]).has.ownProperty('title');
                expect(topics[1].slug).to.equal('cats');
            });
        });

        describe('/:topic_id/articles', () => {

            it('GET returns a 200 and all articles for a given topic id', () => {
                return request
                .get(`/api/topics/${topicDocs[0]._id}/articles`)
                .expect(200)
                .then(res => {
                    const { articles } = res.body;
                    expect(res.body).to.be.an('object');
                    expect(articles.length).to.equal(2);
                    expect(articles[0]).has.ownProperty('title');
                    expect(articles[1].title).to.equal('7 inspirational thought leaders from Manchester UK');
                });
            });

            it('GET returns a 400 when given an invalid string for id', () => {
                return request
                .get(`/api/topics/mrtiddles/articles`)
                .expect(400)
                .then(res => {
                    const { error } = res;
                    expect(error.status).to.equal(400);
                    expect(error.text).to.equal('Bad Request');
                });
            });

            it('GET returns a 404 when id given is a mongoID but does not exist in collection', () => {
                return request
                .get(`/api/topics/${commentDocs[0]._id}/articles`)
                .expect(404)
                .then(res => {
                    const { error } = res;
                    expect(error.status).to.equal(404);
                    expect(error.text).to.equal('Page not found');
                });
            });

            it('POST returns a 201 and an additional article for a given topic id', () => {
                return request
                .post(`/api/topics/${topicDocs[0]._id}/articles`)
                .send({
                    "title": "test title",
                    "body": "test body"
                })
                .expect(201)
                .then(res => {
                    const { belongs_to, title, body } = res.body.article;
                    expect(res.body).to.be.an('object');
                    expect(res.body.article).has.ownProperty('created_by');
                    expect(belongs_to).to.equal(`${topicDocs[0]._id}`);
                    expect(title).to.equal('test title');
                    expect(body).to.equal('test body');
                });
            });
            
            it('POST returns a 400 when sent an invalid JSON object', () => {
                return request
                .post(`/api/topics/${topicDocs[0]._id}/articles`)
                .send({
                    "test": "bad req test body"
                })
                .expect(400)
                .then(res => {
                    const { error } = res;
                    expect(error.status).to.equal(400);
                    expect(error.text).to.equal('Bad Request');
                });
            });

            it('POST returns a 404 when passed a mongoID that does not exist in collection', () => {
                return request
                .post(`/api/topics/${commentDocs[0]._id}/articles`)
                .send({
                    "title": "rich dudes are running out of insults for bitcoin",
                    "body": "price crash as warren buffett calls bitcoin 'rat poison squared' and bill gates joins in bashing it (LOL)"
                })
                .expect(404)
                .then(res => {
                    const { error } = res;
                    expect(error.status).to.equal(404);
                    expect(error.text).to.equal('Page not found');
                });
            });
        });
    });

    describe('/articles', () => {
        it('GET returns a 200 and all articles', () => {
            return request
            .get('/api/articles')
            .expect(200)
            .then(res => {
                const { articlesArr } = res.body;
                expect(res.body).to.be.an('object');
                expect(articlesArr.length).to.equal(4);
                expect(articlesArr[0].body).to.equal('I find this existence challenging');
                expect(articlesArr[3]).has.ownProperty('created_by');
                expect(articlesArr[2].created_by).has.ownProperty('username');
                expect(articlesArr[1]).has.ownProperty('comments');
            });
        });

        describe('/:article_id', () => {
            it('GET returns a 200 and one article by given id', () => {
                return request
                .get(`/api/articles/${articleDocs[0]._id}`)
                .expect(200)
                .then(res => {
                    const { article } = res.body;
                    expect(res.body).to.be.an('object');
                    expect(article).has.ownProperty('body');
                    expect(article.title).to.equal('Living in the shadow of a great man');
                    expect(article).has.ownProperty('comments');
                    expect(article._id).to.equal(`${articleDocs[0]._id}`);
                });
            });

            it('GET returns a 404 when id given is a mongoID but does not exist in collection', () => {
                return request
                .get(`/api/articles/${commentDocs[0]._id}`)
                .expect(404)
                .then(res => {
                    const { error } = res;
                    expect(error.status).to.equal(404);
                    expect(error.text).to.equal('Page not found');
                });
            });

            it('GET returns a 400 when given an invalid id', () => {
                return request
                .get(`/api/articles/mrtiddles`)
                .expect(400)
                .then(res => {
                    const { error } = res;
                    expect(error.status).to.equal(400);
                    expect(error.text).to.equal('Bad Request');
                });
            });

            it('PUT increments the vote count of an article by 1', () => {
                return request
                .put(`/api/articles/${articleDocs[0]._id}?vote=up`)
                .expect(200)
                .then(res => {
                    const { votes } = res.body.article;
                    expect(votes).to.equal(articleDocs[0].votes + 1);
                });
            });

            it('PUT decrements the vote count of an article by 1', () => {
                return request
                .put(`/api/articles/${articleDocs[0]._id}?vote=down`)
                .expect(200)
                .then(res => {
                    const { votes } = res.body.article;
                    expect(votes).to.equal(articleDocs[0].votes - 1);
                });
            });

            it('PUT does not change the vote count if query is not up or down', () => {
                return request
                .put(`/api/articles/${articleDocs[0]._id}?vote=mrtiddles`)
                .expect(200)
                .then(res => {
                    const { votes } = res.body.article;
                    expect(votes).to.equal(articleDocs[0].votes);
                });
            });

            describe('/:article_id/comments', () => {

                it('GET returns a 200 and all comments by given article id', () => {
                    return request
                    .get(`/api/articles/${articleDocs[0]._id}/comments`)
                    .expect(200)
                    .then(res => {
                        const { comments } = res.body;
                        expect(res.body).to.be.an('object');
                        expect(comments[0].belongs_to).to.equal(`${articleDocs[0]._id}`);
                        expect(comments[1].body).to.equal('The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.');
                    });
                });

                it('GET returns a 404 when id given is a mongoID but does not exist in collection', () => {
                    return request
                    .get(`/api/articles/${commentDocs[0]._id}/comments`)
                    .expect(404)
                    .then(res => {
                        const { error } = res;
                        expect(error.status).to.equal(404);
                        expect(error.text).to.equal('Page not found');
                    });
                });

                it('GET returns a 400 when given an invalid id', () => {
                    return request
                    .get(`/api/articles/mrtiddles/comments`)
                    .expect(400)
                    .then(res => {
                        const { error } = res;
                        expect(error.status).to.equal(400);
                        expect(error.text).to.equal('Bad Request');
                    });
                });

                it('POST returns a 201 and an additional comment', () => {
                    return request
                    .post(`/api/articles/${articleDocs[0]._id}/comments`)
                    .send({
                        body: 'old man shouts at bitcoin'
                    })
                    .expect(201)
                    .then(res => {
                        const { comment } = res.body;
                        expect(res.body).to.be.an('object');
                        expect(comment.belongs_to).to.equal(`${articleDocs[0]._id}`);
                        expect(comment.body).to.equal('old man shouts at bitcoin');
                    })
                });

                it('POST returns a 400 when sent an invalid JSON object', () => {
                    return request
                    .post(`/api/articles/${articleDocs[0]._id}/comments`)
                    .send({
                        "test": "bad req test body"
                    })
                    .expect(400)
                    .then(res => {
                        const { error } = res;
                        expect(error.status).to.equal(400);
                        expect(error.text).to.equal('Bad Request');
                    });
                });
            });
        });
    });

    describe('/comments', () => {
        describe('/:comment_id', () => {

            it('PUT increments the vote count of a comment by 1', () => {
                return request
                .put(`/api/comments/${commentDocs[0]._id}?vote=up`)
                .expect(200)
                .then(res => {
                    const { votes } = res.body.comment;
                    expect(votes).to.equal(commentDocs[0].votes + 1);
                });
            });

            it('PUT decrements the vote count of a comment by 1', () => {
                return request
                .put(`/api/comments/${commentDocs[0]._id}?vote=down`)
                .expect(200)
                .then(res => {
                    const { votes } = res.body.comment;
                    expect(votes).to.equal(commentDocs[0].votes - 1);
                });
            });

            it('PUT does not change the vote count if query is not up or down', () => {
                return request
                .put(`/api/comments/${commentDocs[0]._id}?vote=mrtiddles`)
                .expect(200)
                .then(res => {
                    const { votes } = res.body.comment;
                    expect(votes).to.equal(commentDocs[0].votes);
                });
            });

            it('DELETE removes one comment by comment id', () => {
                return request
                .delete(`/api/comments/${commentDocs[0]._id}`)
                .expect(200)
                .then(res => {
                    const { comment } = res.body;
                    expect(res.body).to.be.an('object');
                    expect(comment._id).to.equal(`${commentDocs[0]._id}`);
                    expect(comment.body).to.equal('Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — on you it works.');
                });
            });

            it('DELETE returns a 404 when id given is a mongoID but does not exist in collection', () => {
                return request
                .delete(`/api/comments/${topicDocs[0]._id}`)
                .expect(404)
                .then(res => {
                    const { error } = res;
                    expect(error.status).to.equal(404);
                    expect(error.text).to.equal('Page not found');
                });
            });

            it('DELETE returns a 400 when given invalid id', () => {
                return request
                .delete(`/api/comments/mrtiddles`)
                .expect(400)
                .then(res => {
                    const { error } = res;
                    expect(error.status).to.equal(400);
                    expect(error.text).to.equal('Bad Request');
                });
            });
        });
    });

    describe('/users', () => {
        describe('/:username', () => {
            it('GET returns a 200 and the profile of a user based on given username', () => {
                return request
                .get(`/api/users/${userDocs[0].username}`)
                .expect(200)
                .then(res => {
                    const { user } = res.body;
                    expect(res.body).to.be.an('object');
                    expect(user).has.ownProperty('name');
                    expect(user).has.ownProperty('username');
                    expect(user.name).to.equal('jonny');
                    expect(user.username).to.equal(`${userDocs[0].username}`);
                });
            });

            it('GET returns a 404 when given id instead of username', () => {
                return request
                .get(`/api/users/${userDocs[0]._id}`)
                .expect(404)
                .then(res => {
                    const { error } = res;
                    expect(error.status).to.equal(404);
                    expect(error.text).to.equal('Page not found');
                });
            });
        });
    });
});