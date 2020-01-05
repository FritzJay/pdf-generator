const { INFO_KEYS } = require("./conversions");

const {
  DEFAULT_SOURCE_DIRECTORY,
  DEFAULT_DESTINATION_DIRECTORY
} = require("./conversions");

const EMPTY_PROFILE = {
  [INFO_KEYS.technician]: "",
  [INFO_KEYS.customer]: "",
  [INFO_KEYS.date]: new Date().toISOString().slice(0, 10),
  [INFO_KEYS.so]: "",
  [INFO_KEYS.sourceDirectory]: DEFAULT_SOURCE_DIRECTORY,
  [INFO_KEYS.destinationDirectory]: DEFAULT_DESTINATION_DIRECTORY
};

function createProfile(name, info) {
  const profiles = readProfiles();
  _saveProfiles({
    ...profiles,
    [name]: info
  });
}

function deleteProfile(name) {
  const profiles = readProfiles();
  if (profiles && profiles[name]) {
    delete profiles[name];
    _saveProfiles(profiles);
  } else {
    console.error(`A profile with the name '${name}' does not exists.`);
  }
}

function readProfiles() {
  const stringifiedProfiles = localStorage.getItem("profiles");
  return JSON.parse(stringifiedProfiles);
}

function readProfile(name) {
  const profiles = readProfiles();
  return profiles[name];
}

function _saveProfiles(profiles) {
  localStorage.setItem("profiles", JSON.stringify(profiles));
}

module.exports = {
  EMPTY_PROFILE,
  createProfile,
  readProfiles,
  readProfile,
  deleteProfile
};
