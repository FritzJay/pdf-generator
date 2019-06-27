const {
  generatePDFs,
  FIELDS
} = require('./lib/pdf')

const {
  createProfile,
  updateProfile,
  readProfiles,
  deleteProfile
} = require('./lib/profiles')

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  _initializeForms()
})

function submitForm() {
  const infoInputs = document.querySelectorAll('#info-fieldset input')
  const pdfTypesInputs = document.querySelectorAll('#pdf-types-fieldset input')
  const info = _formatInputsData(infoInputs)
  const pdfTypes = _formatInputsData(pdfTypesInputs)
  generatePDFs(pdfTypes, info)
}

function _formatInputsData(inputs) {
  const fields = {}
  inputs.forEach(function (input) {
    if (input.name === 'Date') {
      [year, month, day] = input.value.split('-')
      fields[FIELDS.dateDay] = day
      fields[FIELDS.dateMonth] = month
      fields[FIELDS.dateYear] = year
    } else {
      fields[input.name] = input.value
    }
  })
  return fields
}

function _initializeForms() {
  document.getElementById('form').onsubmit = function (event) {
    event.preventDefault()
    submitForm()
  }
}