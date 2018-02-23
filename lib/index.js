const puppeteer = require("puppeteer")
const staticServer = require("./static-server")
const { getServerAddress } = require("./util")

class HTML5ToPDF {
  constructor({ inputPath, outputPath }) {
    this.inputPath = inputPath
    this.outputPath = outputPath
  }

  async start() {
    const server = await staticServer(this.inputPath)
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(getServerAddress(server), {
      waitUntil: "networkidle2",
    })
    this.server = server
    this.page = page
    this.browser = browser
  }

  async build() {
    const result = await this.page.pdf({
      path: this.outputPath,
    })
    await this.browser.close()
    return result
  }
}

module.exports = HTML5ToPDF
