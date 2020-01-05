const pdfform = require("pdfform.js");
const { saveFile, getBytes, scanDirectory } = require("./fileSystem");
const {
  convertPropertyValuesToArrays,
  generatePDFPath
} = require("./conversions");

function getAvailablePDFTypes(path) {
  const fileNames = scanDirectory(path);
  return fileNames
    .filter(function(name) {
      return name.endsWith(".pdf");
    })
    .map(function(name) {
      return name.substring(0, name.length - 4);
    });
}

function generatePDFs(pdfTypes, info, source, destination) {
  for (let pdfType in pdfTypes) {
    const inputPDFPath = generatePDFPath(source, pdfType);
    const outputPDFPath = generatePDFPath(destination, pdfType);

    const amount = pdfTypes[pdfType];
    const fields = _getFields(inputPDFPath);
    const updates = _numberDuplicateFields(fields, info);
    const bytes = getBytes(inputPDFPath);

    _generatePDFsOfType(amount, updates, bytes, outputPDFPath);
  }
}

function _getFields(path) {
  const pdfBytes = getBytes(path);
  const fields = pdfform().list_fields(pdfBytes);
  return Object.keys(fields);
}

function _numberDuplicateFields(fields, info) {
  /* Adobe appends numbers to duplicate fields.
  This function determines how many duplicate fields are in the pdf
  and appends the appropriate fields to `info` */
  return Object.keys(info).reduce((acc, field) => {
    const data = info[field];
    const matchOnFieldsWithAppendedNumbers = new RegExp(`${field}_[0-9]`);
    const matchingFields = matchOnFieldsWithAppendedNumbers.exec(
      fields.join(" ")
    );

    // Add keys for every `matchingFields` to `info`
    return matchingFields.reduce(
      (updatedFields, matchingField) => ({
        ...updatedFields,
        [matchingField]: data
      }),
      acc
    );
  }, info);
}

function _generatePDFsOfType(amount, updates, bytes, outputPDFPath) {
  for (i = 0; i < amount; i++) {
    const formattedFields = convertPropertyValuesToArrays(updates);
    const updatedPDFBytes = pdfform().transform(bytes, formattedFields);
    saveFile(updatedPDFBytes, outputPDFPath);
  }
}

module.exports = {
  generatePDFs,
  getAvailablePDFTypes,
  // Testing Export
  _numberDuplicateFields
};
