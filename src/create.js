const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Generator = require('./util/Generator')

module.exports = async function (name, options) {
  // 执行创建命令
  
  // 当前命令行选择的目录
  const cwd = process.cwd()
  // 拼接需要创建的目录地址
  const targetDir = path.join(cwd, name)
  // console.log(targetDir, fs.existsSync(targetDir))

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${targetDir} already exists. Pick an action: (Use arrow keys)`,
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite'
            }, {
              name: 'Cancel',
              value: 'cancel'
            }
          ]
        }
      ])
      if (!action) {
        return;
      } else if (action === 'overwrite') {
        // 移除已存在的目录
        console.log(`\r\nTarget directory ${targetDir} is removing...`)
        await fs.remove(targetDir)
        console.log('Remove succeed')
      }
    }
  }

  const generator = new Generator(name, targetDir)
  generator.create()
}