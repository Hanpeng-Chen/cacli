const { getRepoList, getTagList } = require('./get')
const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const downloadGitRepo = require('download-git-repo')
const path = require('path')
const chalk = require('chalk')

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
    // 对download-git-repo 进行 promisify 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }

  // 获取模板
  async getRepo() {
    // 从远程拉取模板数据
    const repoList = await wrapLoading(getRepoList, 'waiting fetch template')
    if (!repoList || repoList.length === 0) {
      return
    }

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

  // 获取用户选择的版本
  async getTag(repo) {
    const tags = await wrapLoading(getTagList, 'waiting fetch tags', repo)

    if (!tags || tags.length === 0) return null

    const tagsList = tags.map(item => item.name)
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tags,
      message: 'Please choose a tag to create project'
    })

    return tag
  }

  // 下载远程模板
  async download(repo, tag) {
    // 拼接下载地址

    const requestUrl = `cacli-templates/${repo}${tag ? '#' + tag : ''}`

    await wrapLoading(
      this.downloadGitRepo,
      'waiting download template',
      requestUrl,
      path.resolve(process.cwd(), this.targetDir)
    )
  }

  async create() {
    const repo = await this.getRepo()

    const tag = await this.getTag(repo)
    console.log('用户选择了，repo=' + repo + ',tag=' + tag)

    await this.download(repo, tag)

    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  npm run dev\r\n')
  }
}

module.exports = Generator