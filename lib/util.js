const toString = require("lodash/toString")
const { URL } = require("url")
const fs = require("fs")
const map = require("lodash/map")
const isString = require("lodash/isString")
const replace = require("lodash/replace")
const isPlainObject = require("lodash/isPlainObject")
const path = require("path")

const getServerAddress = server => {
  let { address, port } = server.address()
  if (address === "::") {
    address = "localhost"
  }
  return new URL(`http://${address}:${port}`).toString()
}

const convertPath = filePath => {
  if (path.isAbsolute(filePath)) return filePath
  return path.join(process.cwd(), filePath)
}

const getTemplateFilePath = filePath => {
  if (!filePath) {
    return
  }
  return path.resolve(path.join(__dirname, "..", "templates", filePath))
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
  getServerAddress,
  convertPath,
  convertIncludes,
  getTemplateFilePath,
}
