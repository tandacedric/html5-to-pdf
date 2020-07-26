#!/usr/bin/env node

const split = require("lodash/split")
const first = require("lodash/first")
const colors = require("colors/safe")
const commander = require("commander")
const compact = require("lodash/compact")
const toNumber = require("lodash/toNumber")
const castArray = require("lodash/castArray")
const { version } = require("./package.json")
const HTML5ToPDF = require("./lib")

const printMissing = message => {
  commander.outputHelp()
  if (message) {
    console.error(colors.red(message))
  }
  process.exit(1)
}

const die = error => {
  if (!error) return process.exit(0)
  console.error(error.stack)
  process.exit(1)
}

const getOptions = () => {
  commander
    .version(version)
    .option(
      "-i --include <path>..<path>",
      "path to either a javascript asset, or a css asset",
    )
    .option("--page-size [size]", "'A3', 'A4', 'Legal', 'Letter' or 'Tabloid'")
    .option(
      "--landscape",
      "If set it will change orientation to landscape from portriat",
    )
    .option("--print-background", "Whether to print CSS backgrounds")
    .option(
      "-t --template [template]",
      "The template to used. Defaults to html5bp.",
    )
    .option(
      "--template-path [/path/to/template/folder]",
      "Specifies the template folder path for static assets, this will override template.",
    )
    .option(
      "--template-url [http://localhost:8080]",
      "Specifies the template url to use. Cannot be used with --template-path.",
    )
    .option(
      "-d --render-delay [milli-seconds]",
      "Delay before rendering the PDF (give HTML and CSS a chance to load)",
    )
    .option("-o --output <path>", "Path of where to save the PDF")
    .usage("[options] <path/to/html-file-path>")
    .parse(process.argv)
  const inputPath = first(commander.args)
  const outputPath = commander.output
  if (inputPath == null && commander.templateUrl == null) {
    printMissing("Missing input path first argument or template-url")
  }

  const {
    pageSize,
    template,
    templatePath,
    templateUrl,
    renderDelay,
  } = commander
  const printBackground = commander.printBackground
  const landscape = commander.landscape

  const include = compact(castArray(split(commander.include, ",")))

  return {
    inputPath,
    outputPath,
    template,
    templateUrl,
    templatePath,
    renderDelay: toNumber(renderDelay),
    include,
    options: {
      landscape,
      printBackground,
      pageSize,
    },
  }
}

const run = async () => {
  const options = getOptions()
  const pdf = new HTML5ToPDF(options)
  await pdf.start()
  const buf = await pdf.build()
  await pdf.close()
  if (buf != null) {
    process.stdout.write(buf)
  }
}

(async () => {
  try {
    await run()
  } catch (err) {
    die(err)
  }
})()
