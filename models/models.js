const { db } = require('../schema/config')

const { ArticleSchema } = require('../schema/article')
const Article = db.model('articles', ArticleSchema)

const { userSchema } = require('../schema/user')
const User = db.model('users', userSchema)

const { CommentSchema } = require('../schema/comment')
const Comment = db.model('comments', CommentSchema)


module.exports.Article = Article
module.exports.User = User
module.exports.Comment = Comment