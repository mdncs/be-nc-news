const seedDB = require('./seed');
const mongoose = require('mongoose');
const { topicData, userData, articleData } = require('./devData');
const { generateRandomCommentData } = require('../utils');
const DB_URL = require('../config');

const commentData = generateRandomCommentData(articleData, userData);

mongoose
  .connect(DB_URL)
  .then(() => seedDB(topicData, userData, articleData, commentData))
  .then(() => mongoose.disconnect());