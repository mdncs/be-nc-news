const { Comments } = require('../models');

exports.getAllComments = (req, res, next) => {
    return Comments.find()
    .then(comments => res.send({ comments }))
    .catch(next);
}

exports.upDownVoteComment = (req, res, next) => {
    const { vote } = req.query;
    const { comment_id } = req.params;

    const inc = vote === 'up' ? 1 : vote === 'down' ? -1 : 0;

    return Comments.findByIdAndUpdate(
        comment_id,
        { $inc: { votes: inc } },
        { new: true }
    )
    .then(comment => res.send({ comment }))
    .catch(err => next(err));
};

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    return Comments.findByIdAndRemove({_id: comment_id})
    .then(comment => comment === null ? next({ status: 404, msg: 'Page not found' }) : res.send({comment}))
    .catch(err => {
        err.name ==='CastError'
            ? next({ status: 400, msg: 'Bad Request' })
            : err.name === 'ValidationError'
            ? next({ status: 404, msg: 'Page not found' })
            : next(err);
    });
};