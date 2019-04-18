const Router = require('koa-router')
const router = new Router
const user = require('../control/user')
const article = require('../control/article')
const comment = require('../control/comment')
const admin = require('../control/admin')
const upload = require('../util/upload')

router.get('/', user.keepLog, article.getList)

router.get('/user/logout', user.logout)

// 这里 主要用作 用户 的 登陆/注册
// router.get("/user/:id", async (ctx) => { // 动态路由
//   ctx.body = ctx.params.id
// })

// 动态路由 也 可以 用正则
router.get(/^\/user\/(?=reg|login)/, async (ctx) => {
  // show 为 true 则显示 注册 false  则显示 登陆
  const show = /reg$/.test(ctx.path)
  await ctx.render('register.pug', {
    show
  })
})

// 因为 当用户 登陆 或者 注册 点击 button按钮的时候 如果使用 get 请求 会返回一个页面。所以 用户 点击 button的 时候 要用 post
// 处理 用户 登陆 的 post
// 当使用post 请求 的 时候 需要 对参数 进行 解析，使用koa-body
// 处理 用户 注册
router.post('/user/reg', user.reg)

// router.post('/user/login',  async ctx => {
//   console.log('用户 登陆，登陆的数据')
//   console.log(ctx.request.body)
//   const data = ctx.request.body
//   // 先把用户名  提取 出来 ---》 去 数据库 查询 用户名 是否存在----》 如果 存在 把 密码 提取出来，去数据库 比对密码 是否 正确

// })

router.post('/user/login', user.login)

// 文章 发表页面
router.get('/article', user.keepLog, article.addPage)

// 发表文章
router.post('/article', user.keepLog, article.add)

// 查询 文章
router.get('/page/:id', article.getList)

// 文章 详情
router.get('/article/:id', user.keepLog, article.details)

// 新增 评论
router.post('/comment', user.keepLog, comment.save)

// 后台管理 文章 评论 头像
router.get('/admin/:id', user.keepLog, admin.index)

// 头像上传
router.post('/upload', user.keepLog, upload.single('file'), user.upload)

// 获取用户所有评论
router.get('/user/comments', user.keepLog, comment.comList)

// 删除 用户 评论
router.del('/comment/:id', user.keepLog, comment.del)

// 获取用户 文章 列表
router.get('/user/articles', user.keepLog, article.getArtList)

// 删除 用户 文章
router.del('/article/:id', user.keepLog, article.del)

// 404页面
router.get('*', async ctx => {
  await ctx.render('404', {
    title: '404'
  })
})

module.exports = router