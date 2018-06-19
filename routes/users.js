const router = require('express').Router();
const { getAllUsers, getUserByUsername } = require('../controllers/usersC');

router.get('/', getAllUsers);
router.get('/:username', getUserByUsername);

module.exports = router;