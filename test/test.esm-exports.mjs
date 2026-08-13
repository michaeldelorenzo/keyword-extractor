import { createRequire } from "module";
import { strict as assert } from "assert";
import * as esm_extractor from "../index.mjs";

const require = createRequire(import.meta.url);
const cjs_extractor = require("../index.js");

describe("ESM/CJS export parity", function () {
  it("exposes the same named exports as the CommonJS module", function () {
    const cjs_keys = Object.keys(cjs_extractor).sort();
    const esm_keys = Object.keys(esm_extractor)
      .filter((key) => key !== "default")
      .sort();

    assert.deepStrictEqual(
      esm_keys,
      cjs_keys,
      "index.mjs must re-export exactly the same named exports as index.js"
    );
  });

  it("re-exports the exact same values as the CommonJS module", function () {
    for (const key of Object.keys(cjs_extractor)) {
      assert.strictEqual(esm_extractor[key], cjs_extractor[key]);
    }
  });

  it("exposes a default export equal to the CommonJS module.exports", function () {
    assert.strictEqual(esm_extractor.default, cjs_extractor);
  });
});
