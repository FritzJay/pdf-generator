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
    const amount = pdfTypes[pdfType];
    const updates = _numberDuplicateFields(pdfType, source, info);
    _generatePDFsOfType(pdfType, amount, updates, source, destination);
  }
}

function _numberDuplicateFields(pdfType, source, info) {
  /* Adobe appends numbers to duplicate fields.
  This function determines how many duplicate fields are in the pdf
  and generates appends the appropriate fields to `info` */

  const path = generatePDFPath(source, pdfType);
  const pdfBytes = getBytes(path);
  const fields = pdfform().list_fields(pdfBytes);

  console.log(fields);

  return Object.keys(info).reduce((acc, field) => {
    const data = info[field];
    const matchOnFieldsWithAppendedNumbers = new RegExp(`/${field}#[0-9]+/`);
    const matchingFields = Object.keys(fields).filter(f =>
      matchOnFieldsWithAppendedNumbers.exec(f)
    );

    return matchingFields.reduce(
      (updatedFields, matchingField) => ({
        ...updatedFields,
        [matchingField]: data
      }),
      acc
    );
  }, info);
}

function _generatePDFsOfType(pdfType, amount, updates, source, destination) {
  for (i = 0; i < amount; i++) {
    const templatePath = generatePDFPath(source, pdfType);
    const outputPath = generatePDFPath(destination, pdfType, i + 1);
    _updatePDF(templatePath, outputPath, updates);
  }
}

function _updatePDF(path, destination, updates) {
  const pdfBytes = getBytes(path);
  const updatedPDFBytes = _fillPDFForms(pdfBytes, updates);
  saveFile(updatedPDFBytes, destination);
}

function _fillPDFForms(pdfBytes, fields) {
  const formattedFields = convertPropertyValuesToArrays(fields);
  return pdfform().transform(pdfBytes, formattedFields);
}

module.exports = {
  generatePDFs,
  getAvailablePDFTypes,
  // Testing Export
  _numberDuplicateFields
};
