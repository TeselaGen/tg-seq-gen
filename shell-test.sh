#!/bin/bash
# Simple shell test script for tg-seq-gen

# Define test status
TEST_SUCCESS=0
TEST_FAILURE=0

# Helper function for checking test results
check_test() {
  if [ $? -eq 0 ]; then
    echo -e "\033[32m✓ $1\033[0m"
    ((TEST_SUCCESS++))
  else
    echo -e "\033[31m✗ $1\033[0m"
    ((TEST_FAILURE++))
  fi
}

# Helper function to run a command with proper error handling
run_test() {
  local cmd="$1"
  local description="$2"
  
  echo "Running: $cmd"
  if eval "$cmd" > /dev/null 2>&1; then
    check_test "$description"
    return 0
  else
    check_test "$description"
    return 1
  fi
}

# Make sure we're in the correct directory
cd "$(dirname "$0")" || exit 1

# Define the command - use local index.js directly for testing
CMD="node ./index.js"

echo "Running shell tests for tg-seq-gen..."
echo "======================================"

# Test 1: Check if node is available
command -v node >/dev/null 2>&1
check_test "Node.js is available"

# Test 2: Check if the script exists
[ -f "./index.js" ]
check_test "index.js exists"

# Test 3: Generate default GenBank file
$CMD -t gb -c 1
check_test "Generate default GenBank file"
[ -f "pTG_001.gb" ] && rm "pTG_001.gb"

# Test 4: Generate default FASTA file
$CMD -t fasta -c 1
check_test "Generate default FASTA file"
[ -f "pTG_001.fasta" ] && rm "pTG_001.fasta"

# Test 5: Generate CSV file
$CMD -t csv -c 1
check_test "Generate default CSV file"
[ -f "pTG_001.csv" ] && rm "pTG_001.csv"

# Test 6: Generate with custom lengths
$CMD -t gb -c 1 -l 500,600
check_test "Generate GenBank with custom lengths"
[ -f "pTG_001.gb" ] && rm "pTG_001.gb"

# Test 7: Generate with min/max length parameters
$CMD -t fasta -c 1 -i 200 -m 500
check_test "Generate FASTA with min/max length"
[ -f "pTG_001.fasta" ] && rm "pTG_001.fasta"

# Test 8: Generate GenBank with features
$CMD -t gb -c 1 -f 5
check_test "Generate GenBank with features"
[ -f "pTG_001.gb" ] && rm "pTG_001.gb"

# Test 9: Check help output
$CMD --help | grep -q "Generate sequences"
check_test "Help command works properly"

# Test 10: Check version output
$CMD --version | grep -q "1.0.7"
check_test "Version command works properly"

# Print test summary
echo "======================================"
echo "Tests completed: $((TEST_SUCCESS + TEST_FAILURE))"
echo "Tests passed: $TEST_SUCCESS"
echo "Tests failed: $TEST_FAILURE"

# Return exit code based on test results
[ "$TEST_FAILURE" -eq 0 ] && exit 0 || exit 1
