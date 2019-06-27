const fs = require('fs')

function saveFile(data, destination) {
  fs.writeFile(destination, data, function (error) {
    if (error) {
      console.error(error)
    }
    console.log('Saved pdf to ' + destination)
  })
}

function getBytes(path) {
  return fs.readFileSync(path)
}

module.exports = {
  saveFile,
  getBytes
}