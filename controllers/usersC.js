const { Users } = require('../models');


// NEEDS TESTS
exports.getAllUsers = (req, res, next) => {
    return Users.find()
    .then(users => res.send({ users }))
    .catch(next);
}

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    return Users.findOne({ username })
    .then(user => {
        return !user ? next({ status: 404, msg: 'Page not found' }) : res.send({user})
    })
    .catch(err => next(err));
};



// mongoose.Types.ObjectId.isValid(whateverMongoID) // returns boolean - can check for bad request