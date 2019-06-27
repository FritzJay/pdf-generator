// The keys for storing data in local storage
const INFO_KEYS = {
  technician: 'Technician',
  date: 'Date',
  so: 'SO',
  customer: 'Customer',
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

// The names of the types of available PDFs TODO: Find out what types of pdfs we are going to generate
const PDF_Types = {
  pdf1: 'pdf1',
  pdf2: 'pdf2'
}

function formatInputsDataForView(inputs) {
  const fields = {}
  inputs.forEach(function (input) {
    fields[input.name] = input.value
  })
  return fields
}

function formatInfoForPDF(info) {
  const fields = {}
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      if (key === INFO_KEYS.date) {
        [year, month, day] = info[key].split('-')
        fields[PDF_FIELDS.dateDay] = day
        fields[PDF_FIELDS.dateMonth] = month
        fields[PDF_FIELDS.dateYear] = year
      } else {
        fields[key] = info[key]
      }
    }
  }
  return fields
}

function convertPropertyValuesToArrays(fields) {
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
  INFO_KEYS,
  PDF_FIELDS,
  PDF_Types,
  formatInputsDataForView,
  formatInfoForPDF,
  convertPropertyValuesToArrays
}