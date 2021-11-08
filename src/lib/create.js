const path = require('path')
const fs = require('fs-extra')

module.exports = async function (name, options) {
  // 执行创建命令
  
  // 当前命令行选择的目录
  const cwd = process.cwd()
  // 拼接需要创建的目录地址
  const targetAir = path.join(cwd, name)
  console.log(targetAir, fs.existsSync(targetAir))

  if (fs.existsSync(targetAir)) {
    if (options.force) {
      await fs.remove(targetAir)
    } else {
      // TODO: 询问用户是否确定要覆盖
      // Vue CLI v4.5.12
      // ? Target directory D:\personal_workspace\code\vue-demo already exists. Pick an action: (Use arrow keys)
      // > Overwrite
      //   Merge
      //   Cancel
      console.log(`Target directory ${targetAir} already exists.`)
    }
  }
}