const pdfform = require('pdfform.js')

const {
  saveFile,
  getBytes,
  scanDirectory
} = require('./fileSystem')

const {
  convertPropertyValuesToArrays
} = require('./conversions')

function getAvailablePDFTypes(path) {
  const fileNames = scanDirectory(path)
  return fileNames
    .filter(function (name) {
      return name.endsWith('.pdf')
    })
    .map(function (name) {
      return name.substring(0, name.length - 4)
    })
}

function generatePDFs(pdfTypes, info, source, destination) {
  for (let pdfType in pdfTypes) {
    const amount = pdfTypes[pdfType]
    _generatePDFsOfType(pdfType, amount, info, source, destination)
  }
}

function _generatePDFsOfType(pdfType, amount, info, source, destination) {
  for (i = 0; i < amount; i++) {
    const templatePath = `${source}/${pdfType}.pdf`
    const outputPath = `${destination}/${pdfType}_${i + 1}.pdf`
    _updatePDF(templatePath, outputPath, info)
  }
}

function _updatePDF(path, destination, updates) {
  const pdfBytes = getBytes(path)
  const updatedPDFBytes = _fillPDFForms(pdfBytes, updates)
  saveFile(updatedPDFBytes, destination)
}

function _fillPDFForms(pdfBytes, fields) {
  const formattedFields = convertPropertyValuesToArrays(fields)
  return pdfform().transform(pdfBytes, formattedFields)
}

module.exports = {
  generatePDFs,
  getAvailablePDFTypes
}