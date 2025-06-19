const fs = require("fs");

const defaultCount = 10;
const defaultMaxLength = 10000;
const defaultMinLength = 1000;

// Feature types that can appear in GenBank files
const featureTypes = [
  "CDS",
  "gene",
  "misc_feature",
  "promoter",
  "terminator",
  "rep_origin",
  "enhancer",
  "attenuator",
  "misc_binding",
  "protein_bind",
  "misc_signal",
  "regulatory",
];

// Function to generate a random feature for GenBank format
function generateRandomFeature(seqLength) {
  // Select a random feature type
  const featureType =
    featureTypes[Math.floor(Math.random() * featureTypes.length)];

  // Generate a random start position (at least 10bp from the end)
  const maxStart = Math.max(1, seqLength - 10);
  const start = Math.floor(Math.random() * maxStart) + 1;

  // Generate a random end position (between start and end of sequence)
  const end = Math.floor(Math.random() * (seqLength - start)) + start;

  // Generate a random name for the feature
  const featureName = `feature_${Math.floor(Math.random() * 10000)}`;

  // Format the feature in GenBank style
  return `     ${featureType}             ${start}..${end}
                     /label="${featureName}"
                     /note="randomly generated feature"
`;
}

// Function to generate multiple random features for a sequence
function generateFeatures(seqLength, numFeatures) {
  let features = "";
  if (numFeatures > 0) {
    features = "FEATURES             Location/Qualifiers\n";
    for (let i = 0; i < numFeatures; i++) {
      features += generateRandomFeature(seqLength);
    }
  }
  return features;
}

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
      // Get the current date in the format used in GenBank files
      const today = new Date();
      const dateString = today.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).replace(/(\w+)-(\d+)-(\d+)/, '$1-$3').toUpperCase();
      
      // Generate features if numFeatures is specified
      const features = opts.numFeatures ? generateFeatures(bps.length, opts.numFeatures) : '';
      
      return (
        "LOCUS       " +
        name +
        "         " +
        bps.length +
        " bp    DNA     linear  " + dateString + "\n" +
        features +
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
    return genHelper(opts, ({ name, bps }) => {
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
