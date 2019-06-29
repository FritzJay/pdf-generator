const {
  generatePDFs,
  getAvailablePDFTypes,
} = require('./lib/pdf')

const {
  formatInputsDataForView,
  formatInfoForPDF,
  DEFAULT_DESTINATION_DIRECTORY,
  DEFAULT_SOURCE_DIRECTORY
} = require('./lib/conversions')

const {
  EMPTY_PROFILE,
  createProfile,
  readProfiles,
  readProfile,
  deleteProfile
} = require('./lib/profiles')

const NO_PROFILE_SELECTED_VALUE = 'None'

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  _initializeInfo()
  _initializeProfiles()
  _initializeSettings()
  _initializePDFs()
  _initializeSubmitButton()
})

/********* Forms **********/
function _initializeInfo() {
  _setDateToToday()
}

function _setDateToToday() {
  document.getElementById('date').valueAsDate = new Date()
}

function _initializeSubmitButton() {
  document.getElementById('form').onsubmit = function (event) {
    event.preventDefault()
    _submitForm()
  }
}

function _submitForm() {
  const info = _getInfoFromPage()
  const fields = formatInfoForPDF(info)
  const pdfTypes = _getPDFTypesFromPage()
  generatePDFs(pdfTypes, fields)
}

function _getPDFTypesFromPage() {
  const pdfTypesInputs = document.querySelectorAll('#pdf-types-fieldset input')
  return formatInputsDataForView(pdfTypesInputs)
}

function _getInfoFromPage() {
  const infoInputs = document.querySelectorAll('#info-fieldset input')
  return formatInputsDataForView(infoInputs)
}

/********* Profiles **********/

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

function _handleProfilesSelectOnChange(event) {
  const name = event.target.value
  if (name !== NO_PROFILE_SELECTED_VALUE) {
    _selectProfile(name)
  } else {
    // Clear inputs
    _populateFieldset('info-fieldset', EMPTY_PROFILE)
    _populateFieldset('settings-fieldset', EMPTY_PROFILE)
  }
}

function _selectProfile() {
  const name = document.getElementById('profile-select').value
  const profile = readProfile(name)
  _populateFieldset('info-fieldset', profile)
  _populateFieldset('settings-fieldset', profile)
  _clearProfileNameInput()
}

function _clearProfileNameInput() {
  document.getElementById('profile-name-input').value = ''
}

function _handleProfilesSaveButtonOnClick(event) {
  event.preventDefault()
  const name = document.getElementById('profile-name-input').value
  if (_isValidProfileName(name)) {
    _saveProfile(name)
  }
}

function _saveProfile(name) {
  if (confirm(`Are you sure you want to create/update the profile "${name}"?`)) {
    const info = _getInfoFromPage()
    const settings = _getSettingsFromPage()
    createProfile(name, {
      ...info,
      ...settings
    })
    _populateProfilesSelect()
    _setSelectedProfile(name)
  }
}

function _setSelectedProfile(name) {
  const select = document.getElementById('profile-select')
  select.value = name
}

function _handleProfilesDeleteButtonOnClick() {
  document.getElementById('profile-delete-button').onclick = function (event) {
    event.preventDefault()
    const name = document.getElementById('profile-select').value
    if (_isValidProfileName(name)) {
      _deleteProfile(name)
    }
  }
}

function _deleteProfile(name) {
  if (confirm(`Are you sure you want to delete the profile "${name}"?`)) {
    deleteProfile(name)
    _populateProfilesSelect()
    _clearProfileNameInput()
  }
}

function _isValidProfileName(name) {
  const nameWithoutSpaces = name.replace(/\s+/g, '')
  if ((nameWithoutSpaces !== NO_PROFILE_SELECTED_VALUE) && (nameWithoutSpaces !== undefined) && (nameWithoutSpaces !== null) && (nameWithoutSpaces !== '')) {
    return true
  } else {
    alert('Invalid profile name.')
    return false
  }
}

/********* Settings **********/

function _initializeSettings() {
  document.getElementById('source-directory-button').onchange = _handleSourceDirectoryChange
  document.getElementById('destination-directory-button').onchange = _handleDestinationDirectoryChange
  document.getElementById('source-directory-input').value = DEFAULT_SOURCE_DIRECTORY
  document.getElementById('destination-directory-input').value = DEFAULT_DESTINATION_DIRECTORY
}

function _handleSourceDirectoryChange(event) {
  const directory = event.target.files[0].path
  document.getElementById('source-directory-input').value = directory
  _populatePDFTypes(directory)
}

function _handleDestinationDirectoryChange(event) {
  const directory = event.target.files[0].path
  document.getElementById('destination-directory-input').value = directory
}

function _getSettingsFromPage() {
  const settingsInputs = document.querySelectorAll('#settings-fieldset input[type=text]')
  return formatInputsDataForView(settingsInputs)
}

/********* PDFs **********/

function _initializePDFs() {
  const sourceDirectory = document.getElementById('source-directory-input').value
  _populatePDFTypes(sourceDirectory)
}

function _populatePDFTypes(sourceDirectory) {
  const formsFieldset = document.getElementById('pdf-types-fieldset')
  _clearPDFTypes(formsFieldset)
  let pdfTypes
  try {
    pdfTypes = getAvailablePDFTypes(sourceDirectory)
  } catch (error) {
    _addMessageToElement('The source directory does not exist.', formsFieldset, {
      id: 'pdf-types-message'
    })
    return
  }
  _addPDFTypesToFieldset(pdfTypes, formsFieldset)
}

function _addPDFTypesToFieldset(pdfTypes, formsFieldset) {
  if (pdfTypes.length < 1) {
    _addMessageToElement('The source directory does not contain any pdfs.', formsFieldset, {
      id: 'pdf-types-message'
    })
  } else {
    pdfTypes.forEach(function (pdfType) {
      _addPDFTypeLabelToElement(pdfType, formsFieldset)
      _addPDFTypeInputToElement(pdfType, formsFieldset)
    })
  }
}

function _clearPDFTypes(formsFieldset) {
  Array.from(formsFieldset.childNodes).forEach(function (child) {
    if (child.tagName === 'LABEL' || child.tagName === 'INPUT' || child.id === 'pdf-types-message') {
      formsFieldset.removeChild(child)
    }
  })
}

function _addPDFTypeLabelToElement(pdfType, element) {
  const label = document.createElement('label')
  label.innerText = pdfType + ':'
  label.setAttribute('for', pdfType)
  element.appendChild(label)
}

function _addPDFTypeInputToElement(pdfType, element) {
  const input = document.createElement('input')
  input.setAttribute('name', pdfType)
  input.setAttribute('type', 'number')
  input.setAttribute('value', 0)
  input.setAttribute('min', 0)
  input.setAttribute('max', 100)
  element.appendChild(input)
}

/********* PDFs **********/

function _populateFieldset(fieldsetID, savedInfo) {
  const inputs = Array.from(document.querySelectorAll(`#${fieldsetID} input`))
  for (let key in savedInfo) {
    const matchingInput = inputs.find(function (input) {
      return input.name === key
    })
    if (matchingInput) {
      matchingInput.value = savedInfo[key]
    } else {
      console.warn(`Unable to find an input with the name: ${key}`)
    }
  }
}

function _addMessageToElement(message, element, attributes = {}) {
  const p = document.createElement('p')
  Object.keys(attributes).forEach(function (key) {
    p.setAttribute(key, attributes[key])
  })
  p.innerText = message
  element.appendChild(p)
}