const assert = require("assert");
const { getSequenceFileForType } = require("./helperFns");

// Feature types that can appear in GenBank files
const featureTypes = [
  "CDS", "gene", "misc_feature", "promoter", "terminator",
  "rep_origin", "enhancer", "attenuator", "misc_binding", 
  "protein_bind", "misc_signal", "regulatory"
];

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
  const fastas = getSequenceFileForType({
    type: "fasta",
    toFile: false,
  });
  assert.strictEqual(fastas.length, 10);
  assert.strictEqual(fastas[0].includes(">pTG_001"), true);
  assert.strictEqual(fastas[0].length > 1000, true);
  assert.strictEqual(fastas[9].includes(">pTG_0010"), true);
});
it(`can generate genbanks with random features`, () => {
  const numFeatures = 3;
  const gbs = getSequenceFileForType({
    type: "gb",
    toFile: false,
    numFeatures: numFeatures
  });
  assert.strictEqual(gbs.length, 10);
  assert.strictEqual(gbs[0].includes("FEATURES             Location/Qualifiers"), true);
  
  // Count the number of feature entries by counting label occurrences
  const labelMatches = gbs[0].match(/\/label="/g) || [];
  assert.strictEqual(labelMatches.length, numFeatures);

  // Check that the feature entries contain valid positions
  const featureMatch = gbs[0].match(/\s+\w+\s+(\d+)\.\.(\d+)/);
  assert.strictEqual(featureMatch !== null, true);
  
  const start = parseInt(featureMatch[1], 10);
  const end = parseInt(featureMatch[2], 10);
  assert.strictEqual(start <= end, true);
  
  // Verify feature types exist
  const featureTypePattern = new RegExp(featureTypes.join("|"));
  assert.strictEqual(featureTypePattern.test(gbs[0]), true);
});

function getLength(a) {
  return a
    .match(`        1 .*\n`)[0]
    .replace("        1 ", "")
    .replace("\n", "").length;
}
