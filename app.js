const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const winston = require("./config/winston");
const mongoose = require("mongoose");

const app = express();

// Load keys
const keys = require("./config/keys");

// Get Routes
const users = require("./routes/api/users");
const tasks = require("./routes/api/tasks");

/* --------------------------------------------------------------------------- */
// Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS Middleware
app.use(cors());

// Morgan
app.use(morgan("combined", { stream: winston.stream }));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

/* --------------------------------------------------------------------------- */
// Database Connection
mongoose
  .connect(
    keys.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log("ERR in MongoDB connection: ", err));

/* --------------------------------------------------------------------------- */

// Use Routes
app.use("/api/users", users);
app.use("/api/tasks", tasks);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`🚀 Server started at port ${port}...`));
