function createProfile(name, info) {
  const profiles = readProfiles()
  if (profiles && profiles[name]) {
    console.error(`A profile with the name '${name}' already exists.`)
  } else {
    _saveProfiles({
      ...profiles,
      [name]: info
    })
  }
}

function updateProfile(name, info) {
  const profiles = readProfiles()
  if (profiles && profiles[name]) {
    _saveProfiles({
      ...profiles,
      [name]: info
    })
  } else {
    console.error(`A profile with the name '${name}' does not exists.`)
  }
}

function deleteProfile(name) {
  const profiles = readProfiles()
  if (profiles && profiles[name]) {
    delete profiles[name]
    _saveProfiles(profiles)
  }
}

function readProfiles() {
  const stringifiedProfiles = localStorage.getItem('profiles')
  return JSON.parse(stringifiedProfiles)
}

function _saveProfiles(profiles) {
  localStorage.setItem('profiles', JSON.stringify(profiles))
}

module.exports = {
  createProfile,
  updateProfile,
  readProfiles,
  deleteProfile
}