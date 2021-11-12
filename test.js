const assert = require("assert");
const { getSequenceFileForType } = require("./helperFns");

const it = (desc, fn) => {
  try {
    fn();
    console.info("\x1b[32m%s\x1b[0m", `\u2714 ${desc}`);
  } catch (error) {
    console.info("\n");
    console.info("\x1b[31m%s\x1b[0m", `\u2718 ${desc}`);
    console.error(error);
  }
};

it(`can generate genbanks`, () => {
  const gbs = getSequenceFileForType({
    type: "gb",
    toFile: false,
  });
  assert.strictEqual(gbs.length, 10);
  assert.strictEqual(gbs[0].includes("LOCUS       pTG_001"), true);
  assert.strictEqual(gbs[0].includes("//\n"), true);
  assert.strictEqual(gbs[0].length > 1000, true);
  assert.strictEqual(gbs[9].includes("LOCUS       pTG_0010"), true);
});
it(`can generate genbanks passing defined lengths`, () => {
  const gbs = getSequenceFileForType({
    type: "gb",
    toFile: false,
    lengths: "40,41",
  });
  assert.strictEqual(gbs.length, 10);
  assert.strictEqual(gbs[0].includes("LOCUS       pTG_001"), true);
  assert.strictEqual(gbs[0].includes("//\n"), true);

  assert.strictEqual(getLength(gbs[0]), 40);
  assert.strictEqual(getLength(gbs[1]), 41);
  assert.strictEqual(getLength(gbs[2]), 40);
  assert.strictEqual(getLength(gbs[3]), 41);
  assert.strictEqual(gbs[9].includes("LOCUS       pTG_0010"), true);
});

it(`can generate fasta`, () => {
  const gbs = getSequenceFileForType({
    type: "fasta",
    toFile: false,
  });
  assert.strictEqual(gbs.length, 10);
  assert.strictEqual(gbs[0].includes("LOCUS       pTG_001"), true);
  assert.strictEqual(gbs[0].includes("//\n"), true);
  assert.strictEqual(gbs[0].length > 1000, true);
  assert.strictEqual(gbs[9].includes("LOCUS       pTG_0010"), true);
});

function getLength(a) {
  return a
    .match(`        1 .*\n`)[0]
    .replace("        1 ", "")
    .replace("\n", "").length;
}
