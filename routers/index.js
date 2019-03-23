const Router = require('koa-router')
const router = new Router

router.get('/', async (ctx) => { 
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

module.exports = router