const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const router = require('./routers')
const logger = require('koa-logger')
const body = require('koa-body')
const session = require('koa-session')
const { join } = require('path') 
const app = new Koa

app.keys = ['胖虎是个大帅比']

// 这是session的配置对象
const CONFIG = {
  key: 'Sid',
  maxAge: 36e5, // 36后面5个0 的 科学计数法
  overwrite: true, // 是否覆盖
  httpOnly: true, // 是否http可见
  signed: true, // 是否签名
  rolling: true // 是否刷新
}

app.use(logger())
// 注册session
app.use(session(CONFIG, app)) // 手动把app传进去
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

{
  // 创建管理员账户
  const { db } = require('./schema/config.js')
  const  { userSchema } = require('./schema/user.js')
  const encrypto = require('./util/crypt')
  const User = db.model('users', userSchema)
  // 初始化管理员账户 admin  密码 admin
  User
    .find({username: 'admin'})
    .then(data => {
      if (data.length === 0) {
        // 没有则创建
        new User({
          username: 'admin',
          password: encrypto('admin'),
          role: '666',
          commentNum: 0,
          articleNum: 0
        })
        .save()
        .then(data => {
          console.log('管理源用户名admin密码admin')
        })
        .catch(err => {
          console.log('管理员账号检查失败')
        })
      } else {
        // 有则 console.log()
        console.log('{admin: admin}')
      }
    })
}