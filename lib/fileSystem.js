const fs = require("fs");

function scanDirectory(directoryPath) {
  return fs.readdirSync(directoryPath);
}

function saveFile(data, destination) {
  fs.writeFileSync(destination, data);
}

function getBytes(path) {
  return fs.readFileSync(path);
}

module.exports = {
  saveFile,
  getBytes,
  scanDirectory
};
