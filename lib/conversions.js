const DEFAULT_SOURCE_DIRECTORY = './input'
const DEFAULT_DESTINATION_DIRECTORY = './output'

// The keys for storing data in local storage
const INFO_KEYS = {
  technician: 'Technician',
  date: 'Date',
  so: 'SO',
  customer: 'Customer',
  sourceDirectory: 'SourceDirectory',
  destinationDirectory: 'DestinationDirectory'
}

// The field identifiers for filling out PDF forms
const PDF_FIELDS = {
  technician: 'Technician',
  dateDay: 'Date',
  dateMonth: 'undefined',
  dateYear: 'undefined_2',
  so: 'SO',
  customer: 'Customer',
}

function formatInputsDataForView(inputs) {
  const arrayOfInputs = Array.from(inputs)
  return arrayOfInputs.reduce(function (fields, input) {
    fields[input.name] = input.value
    return fields
  }, {})
}

function formatInfoForPDF(info) {
  return Object.keys(info).reduce(function (fields, key) {
    if (key === INFO_KEYS.date) {
      [year, month, day] = info[key].split('-')
      fields[PDF_FIELDS.dateDay] = day
      fields[PDF_FIELDS.dateMonth] = month
      fields[PDF_FIELDS.dateYear] = year
    } else {
      fields[key] = info[key]
    }
    return fields
  }, {})
}

// The pdf library requires form fill values to be arrays of strings
// This function converts all values to arrays
function convertPropertyValuesToArrays(fields) {
  return Object.keys(fields).reduce(function (acc, key) {
    acc[key] = Array(fields[key])
    return acc
  }, {})
}

module.exports = {
  INFO_KEYS,
  PDF_FIELDS,
  formatInputsDataForView,
  formatInfoForPDF,
  convertPropertyValuesToArrays,
  DEFAULT_SOURCE_DIRECTORY,
  DEFAULT_DESTINATION_DIRECTORY
}