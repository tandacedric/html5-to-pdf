const autoBind = require("auto-bind")
const puppeteer = require("puppeteer")
const map = require("lodash/map")
const omitBy = require("lodash/omitBy")
const staticServer = require("./static-server")
const {
  getServerAddress,
  readBodyOrFile,
  convertPath,
  getTemplateFilePath,
  convertIncludes,
} = require("./util")

class HTML5ToPDF {
  constructor(options) {
    this.options = this.parseOptions(options)
    autoBind(this)
  }

  parseOptions(options) {
    const {
      inputBody,
      inputPath,
      outputPath,
      template = "html5bp",
      renderDelay,
      include = [],
    } = options
    const legacyOptions = options.options || {}
    const pdf = omitBy(
      options.pdf || {
        landscape: legacyOptions.landscape,
        format: legacyOptions.pageSize,
        printBackground: legacyOptions.printBackground,
      },
    )
    if (!pdf.path) {
      pdf.path = convertPath(outputPath)
    }
    const templatePath = options.templatePath
      ? options.templatePath
      : getTemplateFilePath(template)
    const body = readBodyOrFile(inputBody, inputPath)
    return {
      body,
      pdf,
      templatePath,
      include: convertIncludes(include),
      renderDelay,
    }
  }

  includeAssets() {
    const includePromises = map(this.options.include, ({ type, filePath }) => {
      if (type === "js") {
        return this.page.addScriptTag({
          path: filePath,
        })
      }
      if (type === "css") {
        return this.page.addStyleTag({
          path: filePath,
        })
      }
    })
    includePromises.push(() => {
      return this.page.addStyleTag({
        path: getTemplateFilePath("pdf.css"),
      })
    })
    includePromises.push(() => {
      return this.page.addStyleTag({
        path: getTemplateFilePath("highlight.css"),
      })
    })
    return Promise.all(includePromises)
  }

  async start() {
    this.server = await staticServer(this.options.templatePath)
    this.browser = await puppeteer.launch()
    this.page = await this.browser.newPage()
    await this.page.goto(getServerAddress(this.server), {
      waitUntil: "networkidle2",
    })
    await this.page.setContent(this.options.body)
    await this.includeAssets()
    await this.page.emulateMedia("screen")
    if (this.options.renderDelay) {
      await this.page.waitFor(this.options.renderDelay)
    }
    return this.page
  }

  async build() {
    const buf = await this.page.pdf(this.options.pdf)
    if (!this.options.pdf.path) {
      return buf
    }
  }

  async close() {
    await this.browser.close()
    this.server.close()
  }
}

module.exports = HTML5ToPDF
