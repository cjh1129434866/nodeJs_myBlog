const Router = require('koa-router')
const router = new Router
const user = require('../control/user')

router.get('/', user.keepLog, async (ctx) => { 
  await ctx.render('index.pug', {  // .pug 可以省略
    title: '这是一个 假装的 title'
  })
})

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
module.exports = router