function createProfile(name, info) {
  const profiles = readProfiles()
  if (profiles && profiles[name]) {
    console.error(`A profile with the name '${name}' already exists.`)
  } else {
    localStorage.setItem('profiles', {
      ...profiles,
      [name]: info
    })
  }
}

function updateProfile(name, info) {
  const profiles = readProfiles()
  if (profiles && profiles[name]) {
    localStorage.setItem({
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
    localStorage.setItem(profiles)
  }
}

function readProfiles() {
  return localStorage.getItem('profiles')
}

module.exports = {
  createProfile,
  updateProfile,
  readProfiles,
  deleteProfile
}