const seedDB = require('./seed');
const mongoose = require('mongoose');
const { topicData, userData, articleData } = require('./devData');
const { generateRandomCommentData } = require('../utils');
const path = require('../config');

const commentData = generateRandomCommentData(articleData, userData);

mongoose.connect(path)
.then(() => seedDB(topicData, userData, articleData, commentData))
.then(() => mongoose.disconnect());