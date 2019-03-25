const crypto = require('crypto')

// 加密 对象 ---》 返回加密成功的 数据
module.exports = function (password, key = 'panghu is da shuai bi') {
  const hmac = crypto.createHmac("sha256", key) // 创建 加密格式
  hmac.update(password) // 加密
  const passwordHmac = hmac.digest("hex") // 输出 16进制
  return passwordHmac
}