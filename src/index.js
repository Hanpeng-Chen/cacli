const program = require('commander')

const { version } = require('./util/constants')

const actionsMap = {
  create: {
    description: 'create project',
    alias: 'cr',
    examples: [
      'cacli create <project-name>'
    ]
  },
  config: {
    description: 'config info',
    alias: 'c',
    examples: [
      'cacli config get <k>',
      'cacli config set <k> <v>'
    ]
  },
  '*': {
    description: 'command not found'
  }
}

Object.keys(actionsMap).forEach((action) => {
  program
    .command(action)
    .description(actionsMap[action].description)
    .action(() => {
      console.log(action)
    })
})

program.version(version)
  .parse(process.argv)