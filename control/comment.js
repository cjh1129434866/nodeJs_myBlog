const { db } = require('../schema/config')

const { ArticleSchema } = require('../schema/article')
const Article = db.model('articles', ArticleSchema)

const { userSchema } = require('../schema/user')
const User = db.model('users', userSchema)

const { CommentSchema } = require('../schema/comment')
const Comment = db.model('comments', CommentSchema)

exports.save = async ctx => {
  let message = {
     status: 0,
     data: '登陆才能发表' 
  }

  if (ctx.session.isNew) return ctx.body = message 
  // 用户登陆了
  let data = ctx.request.body
  data.from = ctx.session.uid

  const _comment = new Comment(data)

  await _comment
    .save()
    .then(data => {
      message = {
        status: 1,
        msg: '评论成功'
      }

      // 更新当前文章的评论计数器
      Article.update({_id: data.article}, {$inc: {commentNum: 1}}, err => { // 自增1
        if (err) return console.log(err)
        console.log('评论计数器 更新 成功')
      }) 

      // 更新用户 评论数 计数器
      User.update({_id: data.from._id}, {$inc: {commentNum: 1}}, err => {
        if (err) return console.log(err)
        console.log('users集合 的 评论技术器 更新成功')
      })
    })
    .catch(err => {
      message = {
        status: 0,
        msg: '发表失败'
      }
    })

  ctx.body = message  
}


