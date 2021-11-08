const program = require('commander')

const { version } = require('./util/constants')

program
  .command('create <project-name>')
  .description('create a new project')
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => {
    require('./lib/create.js')(name, options)
  })

program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <path>', 'get value from option')
  .option('-s, --set <path> <value>')
  .option('-d, --delete <path>', 'delete option from config')
  .action((value, options) => {
    console.log(value, JSON.stringify(options))
  })

// 配置版本号信息
program.version(version)

// 解析用户执行命令传入参数
program.parse(process.argv)