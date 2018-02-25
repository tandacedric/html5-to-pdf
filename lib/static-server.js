const http = require("http")
const fs = require("fs")
const path = require("path")
const { parse } = require("url")

const handleRequest = templatePath => {
  return (req, res) => {
    const { pathname } = parse(req.url)
    let filePath = path.join(templatePath, pathname)
    fs.exists(filePath, exists => {
      if (!exists) {
        res.statusCode = 404
        res.end(`File ${filePath} not found!`)
      }

      if (fs.statSync(filePath).isDirectory()) {
        filePath += "/index.html"
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 500
          res.end(`Error getting the file: ${err}.`)
        } else {
          res.end(data)
        }
      })
    })
  }
}

module.exports = async templatePath => {
  const server = http.createServer(handleRequest(templatePath))
  return new Promise(resolve => {
    server.listen(() => {
      resolve(server)
    })
  })
}
