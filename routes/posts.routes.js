const express = require('express');

const { 
    getAllPost, 
    createPost, 
    updatePost, 
    deletePost,
} = require('../controllers/posts.controller');

const { postExist } = require('../middlewares/posts.middlewares');
const { protectSession, protectUserPost } = require('../middlewares/auth.middlewares');

const { createPostValidators } = require('../middlewares/validators.middlewares');

//Utils
const { upload } = require('../utils/multer.util');

const postRouter = express.Router();

postRouter.use(protectSession);

postRouter.get('/', getAllPost);

//Get only 1 img
//postRouter.post('/', upload.single('postImg'), createPost);

postRouter.post('/', upload.array('postImg', 3), createPost);

postRouter.patch('/:id', postExist, protectUserPost, updatePost);

postRouter.delete('/:id', postExist, protectUserPost, deletePost);

module.exports = { postRouter };
