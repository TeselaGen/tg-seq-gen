#!/usr/bin/env node
 
/**
 * Module dependencies.
 */
 
var program = require('commander');
 
program
  .version('0.0.1')
  .option('-c, --count [count]', 'how many to export of each specified type', "100")
  .option('-t, --type [type]', 'choose one or more of [gb|csv|fasta]', 'gb')
  .parse(process.argv);
 

console.log("file type: ",program.type)
console.log("count: ", program.count)

const fs = require("fs");

function generateCSVFormatSeqs(seqCount) {
  var bps = ["a", "g", "c", "t"];
  var minBps = 1000;
  var maxBps = 10000;

  var seqs = [];
  for (var i = 0; i < seqCount; i++) {
    var newSeq = "";
    for (
      var j = 0;
      j < Math.floor(Math.random() * (maxBps - minBps) + minBps);
      j++
    ) {
      newSeq += bps[Math.floor(Math.random() * 4)];
    }
    newSeq += "";
    seqs.push(newSeq);
  }

  var data = "Name,Sequence\n";

  seqs.forEach((s, i) => {
    data += "pJK000" + (i + 1) + "," + s + "\n";
  });

  console.log("data", data);

  fs.writeFile(`${seqCount}_sequences_with_names.csv`, data, err => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log("Sequences saved!");
  });
}

function generateFastaFormatSeqs(seqCount) {
  var bps = ["a", "g", "c", "t"];
  var min = 20;
  var maxBps = 100;

  var seqs = [];
  for (var i = 0; i < seqCount; i++) {
    var newSeq = "atg";
    for (var j = 0; j < Math.floor(Math.random() * (max - min) + min); j++) {
      newSeq += bps[Math.floor(Math.random() * 4)];
    }
    newSeq += "taa";
    seqs.push(newSeq);
  }

  var fasta = seqs.map((s, i) => {
    return ">pkc_00" + i + "||" + s.length + "|linear\n" + s;
  });
}

function generateGenbanks(seqCount) {
  var bps = ["a", "g", "c", "t"];
  var min = 1;
  var max = 10;

  var genbanks = [];
  for (var i = 0; i < seqCount; i++) {
    var newBps = "";
    for (var j = 0; j < Math.floor(Math.random() * (max - min) + min); j++) {
      newBps += bps[Math.floor(Math.random() * 4)];
    }

    var newName = "pkc_00" + (i + 1);

    var newGenbank =
      "LOCUS       " +
      newName +
      "         " +
      newBps.length +
      " bp    DNA     linear  19-NOV-2018\n" +
      "ORIGIN      \n" +
      "        1 " +
      newBps +
      "\n" +
      "//\n";

    genbanks.push(newGenbank);
  }

  genbanks.forEach((gb, i) => {
    fs.writeFile(`gb_sequence_${i}.gb`, gb, err => {
      // throws an error, you could also catch it here
      if (err) throw err;

      // success case, the file was saved
      // console.log('Sequences saved!');
    });
  });
  console.log("Sequences saved!");
}

if (program.type === "gb") {
  generateGenbanks(program.count);

} else if (program.type === "csv"){
  generateCSVFormatSeqs(program.count);

} else if (program.type === "fasta"){
  generateFastaFormatSeqs(program.count);

}
