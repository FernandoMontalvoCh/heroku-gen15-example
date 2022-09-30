const { User } = require('../models/user.model');
const { Post } = require('../models/post.model');
const { Comment } = require('../models/comment.model');
const { PostImg } = require('../models/postImg.model');

const initModels = () => {

    //1 User <---> M post
    User.hasMany(Post, {foreignKey: 'userId'});
    Post.belongsTo(User);

    // 1Post <----> M Comment
    Post.hasMany(Comment, {foreignKey: 'postId'});
    Comment.belongsTo(Post);

    // 1 User <---> M Comment
    User.hasMany(Comment, {foreignKey: 'userId'});
    Comment.belongsTo(User);

    // 1 Post <---> M PostImg
    Post.hasMany(PostImg, {foreignKey: 'postId'});
    PostImg.belongsTo(Post);
};

module.exports = { initModels }