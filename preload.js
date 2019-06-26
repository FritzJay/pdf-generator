const {
  updatePDF,
  FIELDS
} = require('./pdf')

// Temp vars
const INPUT_PATH = './pdf/input.pdf'
const OUTPUT_PATH = './output/output.pdf'

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  for (const versionType of ['chrome', 'electron', 'node']) {
    document.getElementById(`${versionType}-version`).innerText = process.versions[versionType]
  }

  const fields = {
    [FIELDS.dateDay]: '05',
    [FIELDS.dateMonth]: '19',
    [FIELDS.dateYear]: '1991',
    [FIELDS.technician]: 'Test',
    [FIELDS.so]: 'Test',
    [FIELDS.customer]: 'Test'
  }

  updatePDF(INPUT_PATH, OUTPUT_PATH, fields)
})