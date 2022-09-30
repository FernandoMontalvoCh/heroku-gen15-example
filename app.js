const express = require("express");
const helmet =require("helmet");
const compression = require("compression");
const morgan = require("morgan");

// Routers
const { userRouter } = require("./routes/users.routes");
const { postRouter } = require("./routes/posts.routes");
const { commentsRouter } = require("./routes/comments.routes");

//Controllers
const { globalErrorHandler } = require("./controllers/error.controller");

// Init our Express app
const app = express();

// Enable Express app to receive JSON data
app.use(express.json()); // Middleware

// Add security headers
app.use(helmet());

// Compress responses 
app.use(compression());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else if(process.env.NODE_ENV === 'production') app.use(morgan('combined'))


// Define endpoints
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentsRouter);

// Global error handler
app.use(globalErrorHandler);

// Catch non-existing endpoints
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `${req.method} ${req.url} does not exists in our server`,
  });
});

module.exports = { app };
