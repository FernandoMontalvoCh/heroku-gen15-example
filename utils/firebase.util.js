const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");

//Model
const { PostImg } = require('../models/postImg.model');

const dotenv = require("dotenv");

dotenv.config({ path: './config.env'})

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const uploadPostImgs = async (imgs, postId) => {
  const imgsPromises =  imgs.map(async img => {
    //Create firebase reference
    const [originalName, ext] = img.originalname.split('.'); // -> [pug, jpg]

    //Generamos carpeta para tener el codigo mas organizado y le pasamos el id del post para tenerlo todo ordenado
    const filename = `post/${postId}/${originalName}-${Date.now()}.${ext}`;
    const imgRef = ref(storage, filename);

    //Upload image to firebase
    const result = await uploadBytes(imgRef, img.buffer);

    await PostImg.create({
      postId,
      imgUrl: result.metadata.fullPath,
    });
  });

  await Promise.all(imgsPromises);
};

const getPostImgsUrls = async posts => {
  const postsWithImgsPromises = posts.map(async (post) => {
    // Get imgs Urls
    const postImgsPromises = post.postImgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.imgUrl);
      const imgUrl = await getDownloadURL(imgRef);

      postImg.imgUrl = imgUrl;
      return postImg;
    });

    const postImgs = await Promise.all(postImgsPromises);

    post.postImgs = postImgs;
    return post;
  });

  return await Promise.all(postsWithImgsPromises);

};

module.exports = { storage, uploadPostImgs, getPostImgsUrls };