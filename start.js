const bs = require("browser-sync").create()
const generator = require('@antora/site-generator-default')

bs.init({
  server: './public'
})

const antoraArgs = ['--playbook', 'local-antora-playbook.yml']

;(async () => {
  await generator(antoraArgs, process.env)
  bs.reload("*")
})()

