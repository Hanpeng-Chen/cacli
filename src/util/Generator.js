const { getRepoList } = require('./get')
const ora = require('ora')
const inquirer = require('inquirer')

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message)
  spinner.start()

  try {
    const result = await fn(...args)
    spinner.succeed()
    return result
  } catch(error) {
    spinner.fail('Request failed, refetch ...')
  }
}

class Generator {
  constructor (name, targetDir) {
    // 目录名称
    this.name = name
    // 目标位置
    this.targetDir = targetDir
  }

  // 获取模板
  async getRepo() {
    // 从远程拉取模板数据
    const repoList = await wrapLoading(getRepoList, 'waiting fetch template')

    // 过滤模板名称
    const repos = repoList.map(item => item.name)

    // 选择要下载的模板
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project'
    })

    return repo
  }

  async create() {
    const repo = await this.getRepo()
    console.log('用户选择了，repo=' + repo)
  }
}

module.exports = Generator