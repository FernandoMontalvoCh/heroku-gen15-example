const express = require('express');

const { 
    getAllComment, 
    createComment, 
    updateComment, 
    deleteComment,
} = require('../controllers/Comment.controller');

const { commentExist } = require('../middlewares/comments.middlewares');
const { protectSession, protectUserComment } = require('../middlewares/auth.middlewares');

const commentsRouter = express.Router();

commentsRouter.use(protectSession);

commentsRouter.get('/', getAllComment);

commentsRouter.post('/', createComment );

commentsRouter.patch('/:id', commentExist, protectUserComment, updateComment);

commentsRouter.delete('/:id', commentExist, protectUserComment, deleteComment);

module.exports = { commentsRouter };