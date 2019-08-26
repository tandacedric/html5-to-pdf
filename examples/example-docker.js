#!/usr/bin/env node

const HTML5ToPDF = require("../lib")
const path = require("path")

const run = async () => {
  const html5ToPDF = new HTML5ToPDF({
    inputPath: path.join(__dirname, "assets", "basic.html"),
    outputPath: "/tmp/output.pdf",
    templatePath: path.join(__dirname, "templates", "basic"),
    launchOptions: {
      executablePath: "/usr/bin/chromium-browser",
    },
    include: [
      path.join(__dirname, "assets", "basic.css"),
      path.join(__dirname, "assets", "custom-margin.css"),
    ],
  })

  await html5ToPDF.start().catch(err => console.error(err))
  await html5ToPDF.build().catch(err => console.error(err))
  await html5ToPDF.close().catch(err => console.error(err))
  console.log("DONE")
  process.exit(0)
}

try {
  run()
} catch (error) {
  console.error(error)
}
