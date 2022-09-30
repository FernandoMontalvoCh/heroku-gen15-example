//const path = require('path');
const multer = require("multer");

/* const storage = multer.diskStorage({
  // req, si por alguna razon necesitamos traer algo de req lo podemos mandar a llamar (req.params, req.body)
  // file contiene informacion de los archivos que estamos recibiendo
  destination: (req, file, cb) => {
    // la ruta de donde vamos a guardar los archivos (ruta absoluta) / __dirname variable de nodeJs nos da la ruta absoluta de la carpeta en la cual nos encontramos
    const destPath = path.join(__dirname, '..', 'imgs');
    // callback, en el primer parametro recibe el error, lo colocamos como null ya que no existe, y la segunda var es la ruta 
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    // file -> {
    //  fieldname: 'postImg',
    //  originalname: 'pug.jpg',
    //  encoding: '7bit',
    //  mimetype: 'image/jpeg' // podemos hacer un if para solo recibir el mimetype que querramos  
    //}

    const [ originalName, ext ] = file.originalname.split('.'); // -> [pug, jpg]

    // pug.jpg -> pug-12345.jpg
    const filename = `${originalName}-${Date.now()}.${ext}`;

    cb(null, filename)
  },
});
 */

const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = { upload };
