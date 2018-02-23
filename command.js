#!/usr/bin/env node

const map    = require('lodash/map')
const split    = require('lodash/split')
const includes    = require('lodash/includes')
const first    = require('lodash/first')
const compact    = require('lodash/compact')
const castArray    = require('lodash/castArray')
const path = require('path')
const commander  = require('commander')
const colors    = require('colors/safe')
const HTML5ToPDF   = require('./lib')
const { version } = require('./package.json')

const printMissing = (message) => {
  commander.outputHelp()
  if (message) {
    console.error(colors.red(message))
  }
  process.exit(1)
}

const die = (error) => {
  if (!error) return process.exit(0)
  console.error('Error:', error)
  process.exit(1)
}

const getOptions = () => {
  commander
    .version(version)
    .option('-i --include <path>..<path>',
      'path to either a javascript asset, or a css asset')
    .option('--page-size [size]',
      "'A3', 'A4', 'Legal', 'Letter' or 'Tabloid'")
    .option('--margin-type [n]',
      'Specify the type of margins to use: 0 - default, 1 - none, 2 - minimum')
    .option('--landscape',
      'If set it will change orientation to landscape from portriat')
    .option('--print-background',
      'Whether to print CSS backgrounds')
    .option('-t --template [template]',
      'The template to used. Defaults to html5bp.')
    .option('--template-path [/path/to/template/folder]',
      'Specifies the template folder path for static assets, this will override template.')
    .option('-d --render-delay [milli-seconds]',
      'Delay before rendering the PDF (give HTML and CSS a chance to load)')
    .option('-o --output <path>',
      'Path of where to save the PDF')
    .usage('[options] <path/to/html-file-path>')
    .parse(process.argv)
  const inputPath = first(commander.args)
  const outputPath = commander.output
  if (inputPath == null) {
    printMissing('Missing input path first argument')
  }

  const {
    pageSize,
    template,
    templatePath,
    renderDelay,
    marginType
  } = commander
  const printBackground = commander.printBackground
  const landscape = commander.landscape

  const includeAssets = compact(castArray(split(commander.include, ',')))
  const include = map(includeAssets, (filePath) => {
    type = path.extname(filePath).replace('.', '')
    if (!includes([ 'css', 'js' ], type)) {
      die(new Error(`Invalid asset path ${filePath}`))
    }
    return { type, filePath }
  })

  return {
    inputPath,
    outputPath,
    template,
    templatePath,
    renderDelay,
    include,
    pageOptions: {
      landscape,
      printBackground,
      format,
      marginType,
    }
  }
}

const run = async () => {
  const options = getOptions()
  const pdf = new HTML5ToPDF(options)
  const buf = await pdf.build()
  if(buf != null) {
    process.stdout.write(buf)
  }
  process.exit(0)
}

run()
