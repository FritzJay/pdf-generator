const fs = require('fs')
const pdfform = require('pdfform.js')

const FIELDS = {
  technician: 'Technician',
  dateDay: 'Date',
  dateMonth: 'undefined',
  dateYear: 'undefined_2',
  so: 'SO',
  customer: 'Customer',
}

const INPUT_DIRECTORY = './input'
const OUTPUT_DIRECTORY = './output'

function generatePDFs(pdfTypes, info) {
  for (let pdfType in pdfTypes) {
    const amount = pdfTypes[pdfType]
    _generatePDFsOfType(pdfType, amount, info)
  }
}

function _generatePDFsOfType(pdfType, amount, info) {
  for (i = 0; i < amount; i++) {
    const templatePath = `${INPUT_DIRECTORY}/${pdfType}.pdf`
    const outputPath = `${OUTPUT_DIRECTORY}/${pdfType}_${i + 1}.pdf`
    _updatePDF(templatePath, outputPath, info)
  }
}

function _updatePDF(path, destination, updates) {
  const pdfBytes = _getBytes(path)
  const updatedPDFBytes = _fillPDFForms(pdfBytes, updates)
  _saveFile(updatedPDFBytes, destination)
}

function _getBytes(path) {
  return fs.readFileSync(path)
}

function _fillPDFForms(pdfBytes, fields) {
  const formattedFields = _convertPropertyValuesToArrays(fields)
  return pdfform().transform(pdfBytes, formattedFields)
}

function _saveFile(data, destination) {
  fs.writeFile(destination, data, function (error) {
    if (error) {
      console.error(error)
    }
    console.log('Saved pdf to ' + destination)
  })
}

function _convertPropertyValuesToArrays(fields) {
  const updatedFields = {}
  for (let key in {
      ...fields
    }) {
    if (fields.hasOwnProperty(key)) {
      updatedFields[key] = Array(fields[key])
    }
  }
  return updatedFields
}

module.exports = {
  FIELDS,
  generatePDFs
}