// 链接 数据库 导出 db schema
const mongoose = require('mongoose')
const db = mongoose.createConnection
('mongodb://localhost:3001/blogproject', {useNewUrlParser: true}) 

// 用es6 的 promise 取代 mongoose自实现 的 promise
mongoose.Promise = global.Promise

// 把mongoose 的 Schema 的 取出来
const Schema = mongoose.Schema

db.on('error', () => {
  console.log('数据库链接 失败')
})

db.on('open', () => {
  console.log('数据库链接 成功')
})

module.exports = {
  db,
  Schema
}