const { _numberDuplicateFields } = require("../../lib/pdf");

describe("_numberDuplicateFields", () => {
  it("works", () => {
    const fields = ["SO", "SO_2"];
    const info = { SO: "test" };

    const result = _numberDuplicateFields(fields, info);
    const expected = {
      SO: "test",
      SO_2: "test"
    };

    expect(result).toEqual(expected);
  });
});
