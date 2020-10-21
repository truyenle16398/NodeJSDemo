const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: 'userName is required'
  },
  password: {
    type: String,
    required: 'password is required'
  },
  token: String,
  fullName: String,
  tel: String,
  role: String,
});

module.exports = mongoose.model('User', userSchema);

