const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || 3002;

const app = express();
app.use(express.json());

app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

const db = require("./config/database");
db.connect();

app.get("/", (req, res) => {
  res.send("<h1>Server is running");
});

const task = require("./routes/task");
const user = require("./routes/user");
app.use("/api/v1/user", user);
app.use("/api/v1/task", task);

app.listen(PORT, () => {
  console.log(`App started at Port: ${PORT}`);
});
