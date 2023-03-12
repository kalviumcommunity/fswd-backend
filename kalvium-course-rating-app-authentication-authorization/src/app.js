const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('express').Router();
const courseInfo = require('./routes/courseInfo');
const User = require("./models/user");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv")
  .config();

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

//Connect to database
try {
  mongoose.connect("mongodb://localhost:27017/usersdb", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log("connected to db");
} catch (error) {
  handleError(error);
}

const app = express();
app.use(cors());
app.use(routes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const PORT = 3000;

routes.get('/', (req, res)=>{
  res.status(200).send("Welcome to the kalvium course rating app");
});

routes.use('/courses', courseInfo);

routes.post('/register', (req, res) => {
  const user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    role: req.body.role,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save().then(data => {
    res.status(200)
    .send({
        message: "User Registered successfully"
      });
  }).catch(err => {
    res.status(500)
    .send({
      message: err
    });
    return;
  });
});

routes.post('/signin', (req, res) => {
  User.findOne({
    email: req.body.email
  }).then((user) => {
    if (!user) {
      return res.status(404)
        .send({
          message: "User Not found."
        });
    }
    //comparing passwords
    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    // checking if password was valid and send response accordingly
    if (!passwordIsValid) {
      return res.status(401)
        .send({
          accessToken: null,
          message: "Invalid Password!"
        });
    }
    //signing token with user id
    var token = jwt.sign({
      id: user.id
    }, process.env.API_SECRET, {
      expiresIn: 86400
    });

    //responding to client request with user profile success message and  access token .
    res.status(200)
      .send({
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
        message: "Login successfull",
        accessToken: token,
      });
  }).catch(err => {
    if (err) {
      res.status(500)
        .send({
          message: err
        });
      return;
    }
  });
});

app.listen(process.env.PORT || PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running and App is listening on port " + PORT);
    else
        console.log("Error occurred, server can't start", error);
    }
);
