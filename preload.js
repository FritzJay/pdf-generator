const {
  generatePDFs
} = require('./lib/pdf')
const {
  formatInputsDataForView,
  formatInfoForPDF
} = require('./lib/conversions')

const {
  createProfile,
  readProfiles,
  readProfile,
  deleteProfile
} = require('./lib/profiles')

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  _initializeForms()
})

function submitForm() {
  const info = _getInfoFromPage()
  const fields = formatInfoForPDF(info)
  const pdfTypes = _getPDFTypesFromPage()
  generatePDFs(pdfTypes, fields)
}

function selectProfile() {
  const name = document.getElementById('profile-select').value
  const profile = readProfile(name)
  _populateInfoForm(profile)
  _clearProfileNameInput()
}

function _getInfoFromPage() {
  const infoInputs = document.querySelectorAll('#info-fieldset input')
  return formatInputsDataForView(infoInputs)
}

function _getPDFTypesFromPage() {
  const pdfTypesInputs = document.querySelectorAll('#pdf-types-fieldset input')
  return formatInputsDataForView(pdfTypesInputs)
}

function _populateInfoForm(savedInfo) {
  const infoInputs = Array.from(document.querySelectorAll('#info-fieldset input'))
  for (let key in savedInfo) {
    if (key === 'Date') {
      console.log(savedInfo)
    }
    const matchingInput = infoInputs.find(function (input) {
      return input.name === key
    })
    if (matchingInput) {
      matchingInput.value = savedInfo[key]
    } else {
      console.log(`Unable to find an input with the name: ${key}`)
    }
  }
}

function _initializeForms() {
  _initializeSubmitButton()
  _initializeProfiles()
  _setDateToToday()
}

function _initializeSubmitButton() {
  document.getElementById('form').onsubmit = function (event) {
    event.preventDefault()
    submitForm()
  }
}

function _initializeProfiles() {
  const select = document.getElementById('profile-select')
  _setProfilesSelectOnChange(select)
  _populateProfilesSelect(select)
  _setProfilesSaveButtonOnClick(select)
  _setProfilesDeleteButtonOnClick(select)
}

function _setDateToToday() {
  document.getElementById('date').valueAsDate = new Date()
}

function _setProfilesSelectOnChange(select) {
  select.onchange = function (event) {
    const name = event.target.value
    selectProfile(name)
  }
}

function _populateProfilesSelect(select) {
  select.innerHTML = ''
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

function _setProfilesSaveButtonOnClick(select) {
  document.getElementById('profile-save-button').onclick = function (event) {
    event.preventDefault()
    _saveProfile(select)
  }
}

function _setProfilesDeleteButtonOnClick(select) {
  document.getElementById('profile-delete-button').onclick = function (event) {
    event.preventDefault()
    const name = document.getElementById('profile-select').value
    if (confirm(`Are you sure you want to delete the profile "${name}"?`)) {
      deleteProfile(name)
      _populateProfilesSelect(select)
      _clearProfileNameInput()
    }
  }
}

function _saveProfile(select) {
  const name = document.getElementById('profile-name-input').value
  if (confirm(`Are you sure you want to create/update the profile "${name}"?`)) {
    const info = _getInfoFromPage()
    createProfile(name, info)
    _populateProfilesSelect(select)
  }
}

function _clearProfileNameInput() {
  document.getElementById('profile-name-input').value = ''
}