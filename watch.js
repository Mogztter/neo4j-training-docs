const chokidar = require('chokidar')
const bs = require("browser-sync").create()
const generator = require('@antora/site-generator-default')
const Lock = require('./lock.js')
const processorLock = new Lock()

bs.init({
  server: './public'
})

const antoraArgs = ['--playbook', 'local-antora-playbook.yml']

const watcher = chokidar.watch([
    '4.0-implementing-graph-data-models/modules/ROOT/images/**',
    '4.0-implementing-graph-data-models/modules/ROOT/pages/**.adoc',
    '4.0-intro-neo4j/modules/ROOT/images/**',
    '4.0-intro-neo4j/modules/ROOT/pages/**.adoc',
    'home/modules/ROOT/pages/**.adoc',
  ],
  {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  }
)

async function process () {
  try {
    const hasQueuedEvents = await processorLock.acquire()
    if (!hasQueuedEvents) {
      await generator(antoraArgs, process.env)
      bs.reload("*")
    }
  } catch (err) {
    console.error(err)
  } finally {
    processorLock.release()
  }
}

watcher.on('change', async _ => await process())
watcher.on('unlink', async _ => await process())

process()
