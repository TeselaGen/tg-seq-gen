#!/usr/bin/env node

/**
 * Module dependencies.
 */

const program = require("commander");
const {
  getSequenceFileForType,
  defaultCount,
  defaultMaxLength,
  defaultMinLength,
} = require("./helperFns");

program
  .version("1.0.3")
  .description(
    "Generate sequences of varying formats (gb|csv|fasta). By default it will generate 100 sequences with random lengths between 1k and 10k bps"
  )
  .option(
    "-l, --lengths [lengths]",
    "a comma separated list of how long the sequences should be, overrides min/max length"
  )
  .option(
    "-i, --minLength [minLength]",
    "min length for the seqs being generated",
    defaultMinLength
  )
  .option(
    "-m, --maxLength [maxLength]",
    "max length for the seqs being generated",
    defaultMaxLength
  )
  .option(
    "-c, --count [count]",
    "how many to export of each specified type",
    defaultCount
  )
  .option("-t, --type [type]", "choose one of [gb|csv|fasta]", "gb")
  .parse(process.argv);

console.info("file type: ", program.type);
console.info("count: ", program.count);
if (program.lengths) {
  console.info("generating seqs w/ lengths: ", program.lengths);
} else {
  console.info("generating seqs between: ", program.lengths);
}

getSequenceFileForType(program);
