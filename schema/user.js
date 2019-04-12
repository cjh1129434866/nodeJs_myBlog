const { Schema } = require('./config')

const UserSchema = new Schema({
  username: String,
  password: String,
  role: {
    type: String,
    default: 1
  },
  avatar: {
    type: String,
    default: '/avatar/default.jpg'
  },
  commentNum: Number,
  articleNum: Number
}, {versionKey: false})

module.exports.userSchema = UserSchema