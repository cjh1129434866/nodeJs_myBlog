const { Schema } = require('./config')
const ObjectId = Schema.Types.ObjectId

const ArticleSchema = new Schema({
  title: String,
  content: String,
  author: {
    type: ObjectId, // 数据类型
    ref: 'users'  // 关联 'users' 这个集合（db.model()得第一个参数 怎么写，这里就怎么写）
  },
  tips: String,
  commentNum: Number
}, { versionKey: false, timestamps: {
  createdAt: "created"
} })

module.exports.ArticleSchema = ArticleSchema