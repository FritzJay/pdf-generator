const {
  updatePDF,
  FIELDS
} = require('./pdf')

// Temp vars
const INPUT_PATH = './input/input.pdf'
const OUTPUT_PATH = './output/output.pdf'

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  _initializeForms()
})

function submitForm() {
  const inputs = document.querySelectorAll('#default-form input')
  const data = _formatInputsData(inputs)
  updatePDF(INPUT_PATH, OUTPUT_PATH, data)
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
  document.getElementById('default-form').onsubmit = function (event) {
    event.preventDefault()
    submitForm()
  }
}