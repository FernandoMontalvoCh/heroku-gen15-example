//Models
const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");
const { Comment } = require("../models/comment.model");
const { PostImg } = require("../models/postImg.model");

//Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { uploadPostImgs, getPostImgsUrls } = require("../utils/firebase.util");

const getAllPost = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    where: { status: "active" },
    attributes: ["id", "title", "content", "createdAt"],
    include: [
      { model: User, attributes: ["id", "name"] },
      {
        model: Comment,
        required: false, // OUTER JOIN, para poder recibir todos los comentarios aunque esten vacios (OJO PROOYECTO TRAES RESTAURANTES ACTIVOS Y RESENAS ACTIVAS)
        where: { status: "active" },
        attributes: ["id", "comment", "status", "createdAt"],
      },
      {
        model: PostImg,
      },
    ],
  });

  const postsWithImgs = await getPostImgsUrls(posts);


  res.status(200).json({
    status: "success",
    data: {
      posts: postsWithImgs,
    },
  });
});

const createPost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  // aprovechamos que sabemos el usuario en sessionUser ya que se logea con el token y con su id le permitimos crear 1 post
  const { sessionUser } = req;

  const newPost = await Post.create({
    title,
    content,
    userId: sessionUser.id,
  });

  await uploadPostImgs(req.files, newPost.id);

/*   //Map async ->  async operations with arrays 
  // esto es cuando es mas de un archivo que vamos a subir, lo de abajo si es solo uno
  const postImgsPromises = req.files.map(async file => {
    //Create firebase reference
    const [originalName, ext] = file.originalname.split("."); // -> [pug, jpg]

    //Generamos carpeta para tener el codigo mas organizado y le pasamos el id del post para tenerlo todo ordenado
    const filename = `post/${newPost.id}/${originalName}-${Date.now()}.${ext}`;
    const imgRef = ref(storage, filename);

    //Upload image to firebase
    const result = await uploadBytes(imgRef, file.buffer);

    await PostImg.create({
      postId: newPost.id,
      imgUrl: result.metadata.fullPath,
    });
  });

  await Promise.all(postImgsPromises); */

  /*   //Create firebase reference
  const [originalName, ext] = req.file.originalname.split("."); // -> [pug, jpg]

  //Generamos carpeta para tener el codigo mas organizado y le pasamos el id del post para tenerlo todo ordenado
  const filename = `post/${newPost.id}/${originalName}-${Date.now()}.${ext}`;
  const imgRef = ref(storage, filename);

  //Upload image to firebase
  const result = await uploadBytes(imgRef, req.file.buffer); */

/*   await PostImg.create({
    postId: newPost.id,
    imgUrl: result.metadata.fullPath,
  }); */

  res.status(201).json({
    status: "success",
    data: { newPost },
  });
});

const updatePost = catchAsync(async (req, res, next) => {
  const { title, content, userId } = req.body;

  const { post } = req;

  await post.update({ title, content, userId });

  res.status(200).json({
    status: "success",
    data: { post },
  });
});

const deletePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  await post.update({ status: "delete" });

  res.status(204).json({
    status: "success",
  });
});

module.exports = {
  getAllPost,
  createPost,
  updatePost,
  deletePost,
};
