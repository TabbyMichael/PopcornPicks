#!/usr/bin/env bash
# ============================================================================
# test.sh
# Run database test suites.
# Usage: ./scripts/test.sh [DATABASE_URL]
# ============================================================================
set -euo pipefail

DATABASE_URL="${1:-${DATABASE_URL:-postgres://localhost:5432/popcornpicks}}"
TESTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../tests" && pwd)"

echo "Running database tests from ${TESTS_DIR}"

for test_file in "${TESTS_DIR}"/test_*.sql; do
    [ -e "${test_file}" ] || continue
    echo "Running: $(basename "${test_file}")"
    psql "${DATABASE_URL}" -v ON_ERROR_STOP=1 -f "${test_file}"
done

echo "Database tests completed successfully."