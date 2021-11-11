# tg-seq-gen
Generate sequences of varying formats (gb|csv|fasta). By default it will generate 10 sequences with random lengths between 1k and 10k bps

# Usage:
```
npx tg-seq-gen 

..or..

npx tg-seq-gen -c 100 -t fasta

..or..

npx tg-seq-gen -c 3 --lengths 500,501,502

..or.. 

npx tg-seq-gen --minLength 10 --maxLength 20
```


# Options: 
```
-i, --minLength
min length for the seqs being generated
default=1000

-m, --maxLength
max length for the seqs being generated
default=10000

-c, --count
how many to export of each specified type
default=10
  
-t, --type
choose one of [gb|csv|fasta]
default=gb

-l, --lengths [lengths]
a comma separated list of how long the sequences should be, overrides min/max length
```