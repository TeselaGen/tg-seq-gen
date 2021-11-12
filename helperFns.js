const fs = require("fs");

const defaultCount = 10;
const defaultMaxLength = 10000;
const defaultMinLength = 1000;

function genHelper(
  {
    count = defaultCount,
    lengths,
    maxLength = defaultMaxLength,
    minLength = defaultMinLength,
    postProcess,
    isCDS,
    toFile = true,
    type,
  },
  fn
) {
  if (lengths && typeof lengths === "string") {
    lengths = lengths.split(",").map((n) => Number(n) || 10);
  }
  let lastLength = 0;
  let toRet = [];
  for (let i = 0; i < count; i++) {
    const name = "pTG_00" + (i + 1);
    let length;

    if (lengths) {
      length = lengths[lastLength];
      lastLength++;
      if (lastLength === lengths.length) {
        lastLength = 0;
      }
    }

    const bps = getBps({ length, maxLength, minLength, isCDS });

    toRet.push(fn({ name, bps }));
  }
  if (postProcess) {
    toRet = postProcess(toRet);
  }
  if (toFile) {
    toRet.forEach((seq, i) => {
      fs.writeFile(`sequence_${i}.${type}`, seq, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;
      });
    });
  } else {
    return toRet;
  }
}

function getBps({ length, maxLength, minLength, isCDS }) {
  const bps = ["a", "g", "c", "t"];
  let newBps = isCDS ? "atg" : "";
  if (isCDS) {
    //resize the lengths to account for the cds
    if (length) {
      length = length - 6;
    } else {
      maxLength = maxLength - 6;
    }
  }
  for (
    let j = 0;
    j <
    (length
      ? length
      : Math.floor(Math.random() * (maxLength - minLength) + minLength));
    j++
  ) {
    newBps += bps[Math.floor(Math.random() * 4)];
  }
  if (isCDS) {
    newBps += "taa";
  }
  return newBps;
}

function getSequenceFileForType(opts) {
  if (opts.type === "gb") {
    return genHelper(opts, ({ name, bps }) => {
      return (
        "LOCUS       " +
        name +
        "         " +
        bps.length +
        " bp    DNA     linear  19-NOV-2018\n" +
        "ORIGIN      \n" +
        "        1 " +
        bps +
        "\n" +
        "//\n"
      );
    });
  } else if (opts.type === "csv") {
    genHelper(
      {
        ...opts,
        postProcess: (data) => {
          let toRet = "Name,Sequence\n";
          data.forEach((l) => {
            toRet += l;
          });
          return [toRet];
        },
      },
      ({ name, bps }) => {
        return name + "," + bps + "\n";
      }
    );
  } else if (opts.type === "fasta") {
    genHelper(opts, ({ name, bps }) => {
      return ">" + name + "||" + bps.length + "|linear\n" + bps;
    });
  }
}

module.exports = {
  getSequenceFileForType,
  defaultCount,
  defaultMaxLength,
  defaultMinLength,
};
