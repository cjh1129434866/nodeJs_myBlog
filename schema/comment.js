const { Schema } = require('./config')
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema({
    // 头像  用户名 文章  内容
    content: String,
    from: {
      type: ObjectId,
      ref: 'users'
    },
    article: {
      type: ObjectId,
      ref: 'articles'
    }
}, {
  versionKey: false,
  timestamps: {
    createdAt: "created"
  }
})

exports.CommentSchema = CommentSchema