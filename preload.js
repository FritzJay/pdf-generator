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
  _initializeSubmitButton()
  _initializeProfiles()
}

function _initializeSubmitButton() {
  document.getElementById('form').onsubmit = function (event) {
    event.preventDefault()
    submitForm()
  }
}

function _initializeProfiles() {
  const select = document.getElementById('accounts-select')
  _setProfilesSelectOnChange(select)
  _populateProfilesSelect(select)
  _setProfilesSaveButtonOnClick()
  _setProfilesDeleteButtonOnClick()
}

function _setProfilesSelectOnChange(select) {
  select.onchange = function (event) {
    const name = event.target.value
    selectProfile(name)
  }
}

function _populateProfilesSelect(select) {
  const profiles = readProfiles()
  for (let key in profiles) {
    if (profiles.hasOwnProperty(key)) {
      const option = document.createElement('option')
      option.value = key
      option.innerText = key
      select.appendChild(option)
    }
  }
}

function _setProfilesSaveButtonOnClick() {
  document.getElementById('accounts-save-button').onclick = function () {
    console.log('saving profile')
  }
}

function _setProfilesDeleteButtonOnClick() {
  document.getElementById('accounts-delete-button').onclick = function () {
    console.log('delete clicked')
  }
}

function selectProfile(name) {
  console.log(`selecting profile: ${name}`)
}