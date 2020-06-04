const express = require('express');
const router = express.Router();

const postCtrl = require("../controllers/posts");

const authHelper = require('../helpers/authHelper');

router.post('/post/add-post', authHelper.verifyToken, postCtrl.addPost);

module.exports = router;