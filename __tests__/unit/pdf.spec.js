const path = require("path");
const { _numberDuplicateFields } = require("../../lib/pdf");

describe("_numberDuplicateFields", () => {
  const pdfType = "NTP_Server";
  const inputDirectory = path.resolve(
    "Z:\\Users\\Fritz.Jay\\Documents\\Programming\\pdf-generator\\input"
  );

  it("works", () => {
    const info = { SO: "test" };

    expect(_numberDuplicateFields(pdfType, inputDirectory, info)).toEqual({
      SO: "test",
      "SO#2": "test"
    });
  });
});
