const { db } = require('../schema/config')

const { ArticleSchema } = require('../schema/article')
const Article = db.model('articles', ArticleSchema)

// 取到 users集合 得 schema 来 生成 可以操作 users 集合得 实例
const  { userSchema } = require('../schema/user.js')
const User = db.model('users', userSchema)

const { CommentSchema } = require('../schema/comment')
const Comment = db.model('comments', CommentSchema)

const fs = require('fs')
const { join } = require('path')

exports.index = async ctx => {
  if (ctx.session.isNew) { // 用户未登陆返回404页面
    ctx.status = 404
    return await ctx.render("404", {title: "404"})
  }
  const id = ctx.params.id

  const arr = fs.readdirSync(join(__dirname, "../views/admin"))
  let flag = false
  arr.forEach(item => {
    const name = item.replace(/^(admin\-)|(\.pug)$/g, "")
    if (name === id) {
      flag = true
    }
  })
  
  if(flag) {
    await ctx.render('./admin/admin-'+ id, {
      role: ctx.session.role
    })
  } else {
    ctx.status = 404
    await ctx.render('404', {
      title: '404'
    })
  }
}