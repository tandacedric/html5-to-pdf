const { URL } = require("url")

const getServerAddress = server => {
  let { address, port } = server.address()
  if (address === "::") {
    address = "localhost"
  }
  return new URL(`http://${address}:${port}`).toString()
}

module.exports = { getServerAddress }
