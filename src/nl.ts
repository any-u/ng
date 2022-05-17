import Table from "cli-table3"
import { performance } from "perf_hooks"
import configProvider from "./config"

async function run() {
  const config = configProvider.getConfig()
  
  var table = new Table({
    head: ["name", "type", "config"],
    colWidths: [15, 30, 30],
    style: {
      head: ['blue']
    }
  })

  Object.values(config).forEach((item) => {
    var arr = { [item.name]: [item.type, item.config.join("\n")] }
    table.push(arr)
  })

  console.log(table.toString())
  console.log(`✨  Done in ${performance.now()}ms.\n`)
}

run().catch(console.error)