const { Article, User,  Comment } = require('../models/models')

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

// 后台查询用户 所有 评论
exports.comList = async ctx => {
  const uid = ctx.session.uid
  const data = await Comment.find({from: uid})
    .populate('article', 'title')

    console.log('data', data)
  ctx.body = {
    code: 0,
    count: data.length,
    data
  }  
}

// 删除用户评论
exports.del = async ctx => {
  let res = {
    status: 1,
    message: '删除 成功'
  }
  // 拿到commentId 删除对应 评论
  const commentId = ctx.params.id
  await Comment.findById({_id: commentId}).then(data => {
    // 这里 的 data 就是 new Comment() 这个 实例
    // 实例 调用 的 方法 就是 构造函数 原型上的 方法，只有 原型上的 方法 被 调用的 时候 ，schema的 钩子 才能 监听到。
    data.remove() 
  }).catch(err => {
    res = {
      status: 0,
      message: err
    }
  })
 
  ctx.body = res
}

