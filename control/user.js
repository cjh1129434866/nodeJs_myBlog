const { db } = require('../schema/config.js')
const  { userSchema } = require('../schema/user.js')
const encrypto = require('../util/crypt')
// 把 schema 规范 作用于 userSchema 这个表，只有 db.model() 返回 出来 的 这个 对象 才有 权力 去 查询 表
const User = db.model('users', userSchema)

// 用户 注册
module.exports.reg = async (ctx) => {
  console.log('这是处理 用户注册的中间件')
  const userData = ctx.request.body
  const username = userData.username
  const password = userData.password
  console.log('name===', username)
  console.log('password===', password)
  // 以下假设 用户名 和 密码 格式 都是 正确的
  // 1、 去数据库 user 先查询 当前 发过来 的 username 是否 已被 注册
  await new Promise ((resolve, reject) => {
    User.find({ username }, (err, data) => {
      console.log(err)
      console.log(data)
      if (err) return reject(err)
      // 数据库 没有出错  ---》 用户名 可能 存在 也可能 不存在
      if (data.length !== 0) {
        // 查询到 数据 用户名 已经存在
        return resolve('')
      }
      // 用户名 不存在 需要 存储到 数据库。 用户密码 需要 加密
      const _user = new User({
        username,
        password: encrypto(password)
      })
      _user.save((err, data) => {
        if (err) {
          return reject(err) 
        } else {
          return resolve(data)
        }
      })
    })
  })
  .then(async data => {
    if (data) {
      // 注册成功
      await ctx.render('isOk', {
        status: '注册成功'
      })
    } else {
      // 用户名 已存在
      await ctx.render('isOk', {
        status: '用户名已存在'
      })
    }
  })
  .catch(async err => {
    await ctx.render('isOk', {
      status: '注册失败，请重试'
    })
  })
}

// 用户 登陆
module.exports.login = async (ctx) => {
  const user = ctx.request.body
  const username = user.username
  const password = user.password
  await new Promise((resolve, reject) => {
    User.find({username},(err, data) => {
      if (err) return reject(err)
      if (data.length === 0) return reject('用户名不存在')
      console.log('data===', data)  
      if (data[0].password === encrypto(password)) {
        return resolve(data)
      }
      resolve('') // 密码 不对 走这一步
    })
  })
  .then(async data => {
    if (!data) {
      return ctx.render('isOk', {
        status: '密码不正确，登陆失败'
      })
    }

    // 让用户在他的 cookie 里设置 username password 加密后的 密码 权限
    ctx.cookies.set('username', username, {
      domain: 'localhost', // 主机名
      path: '/', // 所有页面
      maxAge: 36e5, // 过期时间
      httpOnly: true, // true  不让用户端 访问 这个cookie
      overwrite: false // 这里不要覆盖
    })
    // 用户在 数据库 的 id值
    ctx.cookies.set('uid', data[0]._id, {
      domain: 'localhost', // 主机名
      path: '/', 
      maxAge: 36e5,
      httpOnly: true,
      overwrite: false 
    })
    ctx.session = {
      username,
      uid: data[0]._id,
      avatar: data[0].avatar
    }
    // 登陆 成功
    await ctx.render('isOk', {
      status: '登陆成功'
    })
  })
  .catch(async err => {
    if (typeof err === 'string') {
      await ctx.render('isOk', {
        status: err
      })
    } else {
      await ctx.render('isOk', {
        status: '登陆失败'
      })
    }
  })
}

// 用户 登陆  状态 , 保持 登陆 状态
module.exports.keepLog = async (ctx, next) => {
  // 当session里面没有存储 的 时候 ，session下面 会有 一个 默认 的 isNew; 值为 true
 console.log(ctx.session.isNew)
 if (ctx.session.isNew) { // 如果isNew === true 表明 session没有
   if (ctx.cookies.get('username')) {
     ctx.session = {
       username: ctx.cookies.get('username'),
       uid: ctx.cookies.get('uid')
     } 
   }
 }
  await next()
}

module.exports.logout = async ctx => {
  ctx.session = null
  ctx.cookies.set('username', null, {
    maxAge: 0
  })
  ctx.cookies.set('uid', null, {
    maxAge: 0
  })
  // 在后台 对 路由 重定向
  ctx.redirect('/')
} 
