const toString = require("lodash/toString")
const fs = require("fs")
const map = require("lodash/map")
const isString = require("lodash/isString")
const replace = require("lodash/replace")
const isPlainObject = require("lodash/isPlainObject")
const path = require("path")

const convertPath = filePath => {
  if (path.isAbsolute(filePath)) return filePath
  return path.join(process.cwd(), filePath)
}

const getTemplateFilePath = ({ templatePath, template = "html5bp" }) => {
  if (templatePath) return templatePath
  return path.resolve(path.join(__dirname, "..", "templates", template))
}

const readBodyOrFile = (body, filePath) => {
  if (body) {
    return toString(body)
  }
  if (!filePath) {
    return
  }
  if (fs.statSync(filePath).isDirectory()) {
    return
  }
  return fs.readFileSync(convertPath(filePath), "utf-8")
}

const convertIncludes = includes => {
  return map(includes, include => {
    if (isString(include)) {
      return {
        type: replace(path.extname(include), ".", ""),
        filePath: include,
      }
    }
    if (isPlainObject(include)) {
      return include
    }
  })
}
module.exports = {
  readBodyOrFile,
  convertPath,
  convertIncludes,
  getTemplateFilePath,
}
