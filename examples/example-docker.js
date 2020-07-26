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

  await html5ToPDF.start()
  await html5ToPDF.build()
  await html5ToPDF.close()
}

(async () => {
  try {
    await run()
    console.log("DONE")
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  } finally {
    process.exit()
  }
})()

