const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const router = require('./routers')
const logger = require('koa-logger')
const body = require('koa-body')
const { join } = require('path') 
const app = new Koa

app.use(logger())
// 配置 koa-body 处理 post请求 数据
app.use(body())
// 注册 静态资源目录
app.use(static(join(__dirname, 'public'))) 
// 注册 视图 模块
app.use(views(join(__dirname, 'views'), {
    extension: "pug"
  })) 
// 注册 路由 信息
app.use(router.routes()).use(router.allowedMethods())  

app.listen(3000, () => {
  console.log('监听3000端口')
})