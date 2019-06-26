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

function updatePDF(path, destination, updates) {
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

function _saveFile(data, destination) {
  fs.writeFile(destination, data, function (error) {
    if (error) {
      console.error(error)
    }
    console.log('Saved pdf to ' + destination)
  })
}

module.exports = {
  FIELDS,
  updatePDF
}