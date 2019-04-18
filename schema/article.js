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
}})

ArticleSchema.post('remove', (doc) => {
  // 用户 的 articleNum -1  与 文章 关联的 所有 评论 remove
  const { User, Comment } = require('../models/models')
  const { author : uid,  _id : articleId } = doc
  User.findByIdAndUpdate({_id: uid}, {$inc: {articleNum : -1}}).exec()
  Comment.find({article: articleId}).then(data => {
    data.forEach(k => k.remove())
  })
})

module.exports.ArticleSchema = ArticleSchema