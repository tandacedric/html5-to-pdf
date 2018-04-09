#!/usr/bin/env node

const map = require("lodash/map")
const split = require("lodash/split")
const includes = require("lodash/includes")
const first = require("lodash/first")
const compact = require("lodash/compact")
const castArray = require("lodash/castArray")
const toNumber = require("lodash/toNumber")
const path = require("path")
const commander = require("commander")
const colors = require("colors/safe")
const HTML5ToPDF = require("./lib")
const { version } = require("./package.json")

const printMissing = message => {
  commander.outputHelp()
  if (message) {
    console.error(colors.red(message))
  }
  process.exit(1)
}

const die = error => {
  if (!error) return process.exit(0)
  console.error("Error:", error)
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
  if (inputPath == null) {
    printMissing("Missing input path first argument")
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
  await pdf.start().catch(die)
  const buf = await pdf.build().catch(die)
  await pdf.close().catch(die)
  if (buf != null) {
    process.stdout.write(buf)
  }
  process.exit(0)
}

run()
