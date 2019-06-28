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

const NO_PROFILE_SELECTED_VALUE = 'None'

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  _initializeSubmitButton()
  _initializeProfiles()
  _setDateToToday()
})

function _submitForm() {
  const info = _getInfoFromPage()
  const fields = formatInfoForPDF(info)
  const pdfTypes = _getPDFTypesFromPage()
  generatePDFs(pdfTypes, fields)
}

function _selectProfile() {
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

function _initializeSubmitButton() {
  document.getElementById('form').onsubmit = function (event) {
    event.preventDefault()
    _submitForm()
  }
}

function _initializeProfiles() {
  _initializeProfileSelect()
  document.getElementById('profile-save-button').onclick = _handleProfilesSaveButtonOnClick
  document.getElementById('profile-delete-button').onclick = _handleProfilesDeleteButtonOnClick
}

function _initializeProfileSelect() {
  const select = document.getElementById('profile-select')
  select.onchange = _handleProfilesSelectOnChange
  _populateProfilesSelect()
}

function _setDateToToday() {
  document.getElementById('date').valueAsDate = new Date()
}

function _handleProfilesSelectOnChange(event) {
  const name = event.target.value
  if (name !== NO_PROFILE_SELECTED_VALUE) {
    _selectProfile(name)
  }
}

function _populateProfilesSelect() {
  const select = document.getElementById('profile-select')
  select.innerHTML = '<option selected="selected">None</option>'
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

function _handleProfilesSaveButtonOnClick(event) {
  event.preventDefault()
  const name = document.getElementById('profile-name-input').value
  if (name !== NO_PROFILE_SELECTED_VALUE) {
    _saveProfile(name)
  }
}

function _handleProfilesDeleteButtonOnClick() {
  document.getElementById('profile-delete-button').onclick = function (event) {
    event.preventDefault()
    const name = document.getElementById('profile-select').value
    if (name !== NO_PROFILE_SELECTED_VALUE) {
      _deleteProfile(name)
    }
  }
}

function _saveProfile(name) {
  if (confirm(`Are you sure you want to create/update the profile "${name}"?`)) {
    const info = _getInfoFromPage()
    createProfile(name, info)
    _populateProfilesSelect()
  }
}

function _deleteProfile(name) {
  if (confirm(`Are you sure you want to delete the profile "${name}"?`)) {
    deleteProfile(name)
    _populateProfilesSelect()
    _clearProfileNameInput()
  }
}

function _clearProfileNameInput() {
  document.getElementById('profile-name-input').value = ''
}