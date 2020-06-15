const Joi = require('@hapi/joi');
const HttpStatus = require('http-status-codes');

const Post = require('../models/postModels');
const User = require('../models/userModels');

module.exports = {
    addPost(req, res) {
        const schema = Joi.object({
            post: Joi.string().required()
        })
        const { error } = schema.validate(req.body);
        if (error) { return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details }) }

        const body = {
             user:  req.user._id,
             username: req.user.username,
             post: req.body.post,
             created: new Date()
        }
        Post.create(body).then(async (post) => {
            await User.update({
                _id: req.user._id
            }, {
                $push: {
                    posts: {
                        postId: post._id,
                        post: post.post,
                        created: new Date()
                    }
                }
            })
            res.status(HttpStatus.OK).json({message: 'Post Created', post });
        }).catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'error occured'});
        })
    },

    async getAllPosts(req, res) {
        try {
            const posts = await Post.find({})
                .populate('user')
                .sort({createdAt: -1})
            return res.status(HttpStatus.OK).json({message: 'All posts', posts});
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error Occured'});
        }
    }
}