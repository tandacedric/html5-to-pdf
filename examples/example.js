const HTML5ToPDF = require("../lib")
const path = require("path")

const run = async () => {
  const html5ToPDF = new HTML5ToPDF({
    inputPath: path.join(__dirname, "templates", "basic"),
    outputPath: path.join(__dirname, "..", "tmp", "output.pdf"),
  })

  await html5ToPDF.start()
  await html5ToPDF.build()
  console.log("DONE")
  process.exit(0)
}

try {
  run()
} catch (error) {
  console.error(error)
}
