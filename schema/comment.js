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

// 设置 comment 的 remove 钩子
// pre 是前置钩子，是再删除 事件  执行 之前 执行的钩子； 那么前置钩子 可以绑定 很多个 remove 事件（save事件同理）
// 每个钩子里面都有一个 回调函数，函数的 第一个 参数 是 next; 通过 next() 把 控制权交给 下一个 钩子；他们的 执行顺序 是从上往下依次执行。
// 如果没有 next() 那么 后面的 钩子 不会被 执行
// pre钩子 的回调函数 里面 有个this指向，指向 被删除的 文档; 所以这里 想用 this不能写 箭头函数
CommentSchema.pre('remove', function (next) {
  next()
})
// CommentSchema.pre('remove', function (next) {
//   next()
// })
// CommentSchema.pre('remove', function (next) {
//   next()
// })
// CommentSchema.pre('remove', function (next) {
//   next()
// })

// post 是后置钩子，他是在 所有的 钩子 执行 结束之后 才会执行的钩子，同时 也是  在 删除事件 执行 之前 执行的，它只有一个
// post钩子的 第一个 参数 是 document, 指向 被删除 文档；
CommentSchema.post('remove', (doc) => {
  // 当前 这个回调函数 一定 在  remove之前 触发
  
  // 对应 文章的 评论 数 -1； 对应 用户 的 commentNum -1
  // 注意： 这一一定 要在 这个 回调里面 引入 这两个 model 对象
  const { Article, User } = require('../models/models')
  // 获取到 文章 id  和 用户 id
  const { from, article } = doc
  Article.update({_id: article}, {$inc: {commentNum: -1}}).exec()
  User.update({_id: from}, {$inc: {commentNum: -1}}).exec()
})

// 注意啦 ：文档对象 自身 调用的 方法 才能 监听 到 这些 钩子

exports.CommentSchema = CommentSchema