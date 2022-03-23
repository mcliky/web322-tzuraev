const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: String,
  dateCreated: {
    type: Date,
    default: Date.now()
  }
});

userSchema.pre("save", function (next) {
  let user = this;

  bcrypt
    .genSalt(10)
    .then((salt) => {
      bcrypt
        .hash(user.password, salt)
        .then((hashedPwd) => {
          user.password = hashedPwd;
          next();
        })
        .catch((err) => {
          console.log(`Error occurred when hashing ... ${err}`);
        });
    })
    .catch((err) => {
      console.log(`Error occurred when hashing ... ${err}`);
    });
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;