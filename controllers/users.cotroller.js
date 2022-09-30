const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const { User } = require("../models/user.model");
const { Post } = require("../models/post.model");
const { Comment } = require("../models/comment.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    where: { status: "active" },
    include: [
      {
        model: Post,
        include: {
          model: Comment,
          include: { model: User },
        },
      },
      {
        model: Comment,
      },
    ],
  });

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (role !== "admin" && role !== "normal") {
    return next(new AppError('Invalid role', 400));
  }

  // Encrypt the password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  // pass1234 -> ferajkbansfk123 /no es 100% aleatorio
  // pass1234 -> ferajkbansfk123 / el salto le agrega una capa mas de aleatoriedad

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
  // da como resultados claves aleatorias.

  // Remove password from response
  newUser.password = undefined;

  // 201 -> Success and a resource has been created
  res.status(201).json({
    status: "success",
    data: { newUser },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  // const { anyPropName } = req;
  const { user } = req;

  // Method 1 : Update by using the model
  // const updatedUser = await User.update({ name }, { where: { id } });
  await user.update({ name });

  // Method 2 : Update using a model's instance
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  // Method : Delete by using the model's instance
  // user.destroy();

  // If user exist, remove it from db "soft delete"
  await user.update({ status: "deleted" });

  res.status(204).json({
    status: "success",
  });
});

// Generate random jwt signs
// require('crypto').randomBytes(64).toString('hex') -> Enter into the node console and paste the command
const login = catchAsync(async (req, res, next) => {
  // Get email and password from req.body
  const { email, password } = req.body;

  // Validate if the user exist with given email
  const user = await User.findOne({
    where: { email, status: "active" },
  });

  /*     // If user dosen't exist, send error
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User whit given email dosent exist",
      });
    }
    // Compare passwords (entered password vs db password)
    const isPasswordValid = await bcrypt.compare(password, user.password); */

  // Compare passwords (entered password vs db password)
  // If user dosen't exist or password dosen't match, send error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Wrong credentials', 400));
  }

  // Remove password from response
  user.password = undefined;

  // Generate jsonwebtoken, (Payload, Firma"secretOrPrivateKey", Options) se puede pasar name o lo que quiera
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    status: "success",
    data: { user, token },
  });
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
};
