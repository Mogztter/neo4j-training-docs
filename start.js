const bs = require("browser-sync").create()
const generator = require('@antora/site-generator-default')

const antoraArgs = ['--playbook', 'local-antora-playbook.yml']

;(async () => {
  await generator(antoraArgs, process.env)
  bs.init({
    server: './public'
  })
})()

