const { db } = require('../schema/config')

const { ArticleSchema } = require('../schema/article')
const Article = db.model('articles', ArticleSchema)

// 取到 users集合 得 schema 来 生成 可以操作 users 集合得 实例
const  { userSchema } = require('../schema/user.js')
const User = db.model('users', userSchema)

const { CommentSchema } = require('../schema/comment')
const Comment = db.model('comments', CommentSchema)

// 返回文章发表页
exports.addPage = async ctx => {
  await ctx.render('add-article', {
    title: '这是文章发表页',
    session: ctx.session
  })
}

// 添加文章(保存到数据库)
exports.add = async ctx => {
  if (ctx.session.isNew) {
    // 用户未登陆  不需要查询数据库
    return ctx.body = {
      status: 0,
      msg: '用户未登陆'
    }
  }

  // 用户登陆的情况
  // 这是用户登陆的情况下，前端发送过来 的 数据
  const data = ctx.request.body
  // data里面 没有 文章的 作者，所以 要 添加 文章的 作者
  data.author = ctx.session.uid
  // 初始化 文章 评论 数量
  data.commentNum = 0 

  // new Article(data)
  //   .save()  // save() 里面 可以写 回调，注意： 这里的回调 跟 then() 只能写一个
  //   .then()

  await new Promise((resolve, reject) => {
    new Article(data)
      .save((err, data) => {
        if (err) {
          return reject(err) 
        } else {
          User.update({_id: data.author}, {$inc: {articleNum: 1}}, (err) => {
            if (err) return console.log(err)
            console.log('users集合 的 文章计数器更新成功')
          })
          resolve(data)
        }
      })
  }).then(data => {
    ctx.body = {
      msg: '发表成功',
      status: 1
    }
  }).catch(err => {
    ctx.body = {
      msg: '发表失败',
      status: 0
    }
  })
}

// 获取 文章 列表
exports.getList = async ctx => {
  // 查询每篇文章对应的作者的头像
  // id ctx.params.id 获取动态路由

  let page = ctx.params.id
  page--

  const maxNum = await Article.estimatedDocumentCount((err, data) => err? console.log(err) : data)
  console.log(maxNum)
  const artList = await Article
    .find()  // 查询到 所有的 文章
    .sort('-created') // 排序 'created' 根据这个属性的值 做 升序排序；'-created' 根据这个 属性的值 做 降序排序
    .skip(2 * page) // 跳过多少页，每页2条
    .limit(2) // 筛选接下来 的  多少条 数据
    // 最终得出的 结果 拿到了 2条数据
    .populate({
      path: 'author', // 关联属性
      select: 'username _id avatar' // 需要获取的 关联集合里面 的 哪些数据
    }) // mongoose 用于连表查询 
    .then(data => data)
    .catch(err => console.log(err))

  console.log(artList)

  await ctx.render('index', {
    session: ctx.session,
    title: '这是首页title',
    avatar: ctx.avatar,
    artList,
    maxNum
  })
}

// 获取文章详情页
exports.details = async ctx => {
  const _id = ctx.params.id

  // 查找文章数据
  const article = await Article.findById(_id)
    .populate('author', 'username')
    .then(data => data)

  // 查找关于文章的 所有 评论
  const comment = await Comment
    .find({ article: _id })
    .sort('-created')
    .populate('from', 'username avatar')
    .then(data => data)
    .catch(err => console.log(err))

  console.log(comment)

  await ctx.render('article', {
    title: article.title,
    article,
    session: ctx.session,
    comment
  })  
}