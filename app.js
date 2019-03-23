const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const router = require('./routers')
const logger = require('koa-logger')
const { join } = require('path') 
const app = new Koa

app.use(logger())
  .use(static(join(__dirname, 'public'))) // 注册 静态资源目录
  .use(views(join(__dirname, 'views'), {
    extension: "pug"
  })) // 注册 视图 模块
  
// 注册 路由 信息
app.use(router.routes()).use(router.allowedMethods())  

app.listen(3000, () => {
  console.log('监听3000端口')
})